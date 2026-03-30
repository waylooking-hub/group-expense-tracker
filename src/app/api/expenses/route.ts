import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('groupId');

  if (!groupId) {
    return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('expenses')
    .select('*, member:members!paid_by(*)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const group_id = formData.get('group_id') as string;
  const paid_by = formData.get('paid_by') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const currency = formData.get('currency') as string;
  const description = formData.get('description') as string;
  const receipt = formData.get('receipt') as File | null;
  const splitBetweenRaw = formData.get('split_between') as string | null;

  if (!group_id || !paid_by || !amount || !currency || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = getSupabase();
  let receipt_url: string | null = null;

  if (receipt && receipt.size > 0) {
    const fileExt = receipt.name.split('.').pop();
    const fileName = `${group_id}/${Date.now()}.${fileExt}`;
    const buffer = Buffer.from(await receipt.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, buffer, {
        contentType: receipt.type,
      });

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);
      receipt_url = urlData.publicUrl;
    }
  }

  const split_between: string[] | null = splitBetweenRaw
    ? JSON.parse(splitBetweenRaw)
    : null;

  const { data, error } = await supabase
    .from('expenses')
    .insert({ group_id, paid_by, amount, currency, description, receipt_url, split_between })
    .select('*, member:members!paid_by(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }

  return NextResponse.json(data);
}
