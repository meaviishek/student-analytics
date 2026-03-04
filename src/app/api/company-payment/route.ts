import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { companyName, contactEmail, transactionId } = body;

        if (!companyName || !contactEmail || !transactionId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert company record
        const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .insert([{
                company_name: companyName,
                contact_email: contactEmail,
                transaction_id: transactionId,
                amount: 5999,
                status: 'active',
            }])
            .select()
            .single();

        if (companyError) {
            console.error('Supabase insert company error:', companyError);
            return NextResponse.json({ error: companyError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, companyId: companyData.id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
