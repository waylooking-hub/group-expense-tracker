import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('groupId');

  if (!groupId) {
    return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*, member:members!paid_by(*)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Fetch splits for all expenses
  const expenseIds = expenses.map((e: { id: string }) => e.id);
  const { data: splits } = await supabase
    .from('expense_splits')
    .select('expense_id, member_id, member:members(*)')
    .in('expense_id', expenseIds.length > 0 ? expenseIds : ['none']);

  // Attach splits to expenses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splitsMap = new Map<string, any[]>();
  for (const s of (splits ?? []) as { expense_id: string; member_id: string; member: unknown }[]) {
    const list = splitsMap.get(s.expense_id) ?? [];
    list.push(s);
    splitsMap.set(s.expense_id, list);
  }

  const enriched = expenses.map((e: { id: string }) => {
    const expSplits = splitsMap.get(e.id) ?? [];
    return {
      ...e,
      split_among: expSplits.map(s => s.member_id),
      split_members: expSplits.map(s => s.member),
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const group_id = formData.get('group_id') as string;
  const paid_by = formData.get('paid_by') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const currency = formData.get('currency') as string;
  const description = formData.get('description') as string;
  const receipt = formData.get('receipt') as File | null;
  const splitAmong = formData.get('split_among') as string | null;

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

  const { data, error } = await supabase
    .from('expenses')
    .insert({ group_id, paid_by, amount, currency, description, receipt_url })
    .select('*, member:members!paid_by(*)')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }

  // Save splits if specific members selected (not "all")
  const memberIds: string[] = splitAmong ? JSON.parse(splitAmong) : [];
  if (memberIds.length > 0) {
    const rows = memberIds.map(member_id => ({
      expense_id: data.id,
      member_id,
    }));
    await supabase.from('expense_splits').insert(rows);
  }

  return NextResponse.json({ ...data, split_among: memberIds });
}
