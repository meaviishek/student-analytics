import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, domain, commonScore, domainScore, commonInterpretation, domainInterpretation } = body;

        if (!userId || !domain || commonScore === undefined || domainScore === undefined || !commonInterpretation || !domainInterpretation) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('assessments')
            .insert([{
                user_id: userId,
                domain,
                common_score: commonScore,
                domain_score: domainScore,
                common_interpretation: commonInterpretation,
                domain_interpretation: domainInterpretation
            }])
            .select();

        if (error) {
            console.error('Supabase insert assessment error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
