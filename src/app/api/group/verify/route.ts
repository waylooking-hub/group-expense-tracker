import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { pin } = await request.json();

  if (!pin) {
    return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: groups, error } = await supabase
    .from('groups')
    .select('*');

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  for (const group of groups ?? []) {
    const match = await bcrypt.compare(pin, group.pin_hash);
    if (match) {
      const { data: members } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', group.id)
        .order('created_at', { ascending: true });

      return NextResponse.json({
        group: {
          id: group.id,
          name: group.name,
          default_currency: group.default_currency,
        },
        members: members ?? [],
      });
    }
  }

  return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
}
