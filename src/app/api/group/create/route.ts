import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { name, pin, default_currency } = await request.json();

  if (!name || !pin) {
    return NextResponse.json({ error: 'Name and PIN are required' }, { status: 400 });
  }

  if (pin.length < 4) {
    return NextResponse.json({ error: 'PIN must be at least 4 characters' }, { status: 400 });
  }

  const pin_hash = await bcrypt.hash(pin, 10);
  const supabase = getSupabase();

  const { data: group, error } = await supabase
    .from('groups')
    .insert({ name, pin_hash, default_currency: default_currency || 'PLN' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }

  return NextResponse.json({
    group: {
      id: group.id,
      name: group.name,
      default_currency: group.default_currency,
    },
  });
}
