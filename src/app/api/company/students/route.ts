import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch all users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (usersError) {
            return NextResponse.json({ error: usersError.message }, { status: 500 });
        }

        // Fetch all assessments
        const { data: assessments, error: assessmentsError } = await supabase
            .from('assessments')
            .select('*')
            .order('created_at', { ascending: false });

        if (assessmentsError) {
            return NextResponse.json({ error: assessmentsError.message }, { status: 500 });
        }

        // Join: pick the latest assessment per user
        const assessmentMap = new Map<string, any>();
        for (const assessment of assessments || []) {
            if (!assessmentMap.has(assessment.user_id)) {
                assessmentMap.set(assessment.user_id, assessment);
            }
        }

        const enriched = (users || []).map((user: any) => {
            const assessment = assessmentMap.get(user.id) || null;
            let score = null;
            if (assessment) {
                const maxPoints =
                    assessment.domain === 'Finance' ? 165 :
                        assessment.domain === 'HR' ? 190 :
                            160;
                const total = (assessment.common_score || 0) + (assessment.domain_score || 0);
                score = Math.round((total / maxPoints) * 100);
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                college: user.college,
                domain: user.domain,
                registered_at: user.created_at,
                career_readiness_score: score,
                assessment_id: assessment?.id || null,
                common_score: assessment?.common_score || null,
                domain_score: assessment?.domain_score || null,
                common_interpretation: assessment?.common_interpretation || null,
                domain_interpretation: assessment?.domain_interpretation || null,
            };
        });

        return NextResponse.json({ success: true, students: enriched });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
