import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('groupId');

  if (!groupId) {
    return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { group_id, name } = await request.json();

  if (!group_id || !name) {
    return NextResponse.json({ error: 'group_id and name are required' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('members')
    .insert({ group_id, name })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }

  return NextResponse.json(data);
}
