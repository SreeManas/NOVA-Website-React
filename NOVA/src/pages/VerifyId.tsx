import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase/supabaseClient';
import '../components/community/Community.css'; // Reuse community styles

const VerifyId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        if (!id) throw new Error('No ID provided');
        
        // Use full UUID if it's a UUID, else maybe handle mock IDs
        const { data, error } = await supabase
          .from('nova_id_applications')
          .select('*, profiles(level, points_total)')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data.status !== 'approved') {
          throw new Error('This NOVA ID is not currently active/approved.');
        }

        setApplication(data);
      } catch (e: any) {
        setError(e.message || 'Invalid or missing NOVA ID');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="cm-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="cm-loading-spinner"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="cm-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', textAlign: 'center' }}>
          <i className="fas fa-times-circle" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem' }} />
          <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Verification Failed</h2>
          <p style={{ color: '#9ca3af' }}>{error}</p>
          <Link to="/community" style={{ display: 'inline-block', marginTop: '1rem', color: '#10B981', textDecoration: 'none' }}>Back to Community</Link>
        </div>
      </div>
    );
  }

  const novaIdPrefix = `NOVA-${application.id.split('-')[0].toUpperCase()}`;

  return (
    <div className="cm-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="cm-hero-badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <i className="fas fa-shield-check" /> Verified Identity
          </div>
          <h1 style={{ color: '#fff', fontSize: '2rem' }}>NOVA Verification</h1>
          <p style={{ color: '#9ca3af' }}>This digital student ID is officially verified by NOVA.</p>
        </div>

        {/* Reusing member card styles */}
        <div className="cm-member-card cm-card-premium" style={{ transform: 'none' }}>
          <div className="cm-member-card-bg" />
          <div className="cm-card-glow" />
          <div className="cm-member-card-content">
            <div className="cm-member-card-header">
              <div className="cm-member-avatar cm-avatar-premium">
                <i className="fas fa-user-astronaut" />
                <div className="cm-avatar-ring" style={{ borderColor: '#10B981' }} />
              </div>
              <div className="cm-member-header-right">
                <div className="cm-member-badge-verified">
                  <i className="fas fa-check-circle" /> Verified Member
                </div>
              </div>
            </div>

            <h2 className="cm-member-name">{application.full_name}</h2>
            <p className="cm-member-id">{novaIdPrefix}</p>

            <div className="cm-member-details">
              <span><i className="fas fa-building" /> {application.department}</span>
              <span><i className="fas fa-graduation-cap" /> {application.year_of_study} Year</span>
              <span>
                <i className="fas fa-star" style={{ color: '#10B981' }} />
                <span style={{ color: '#10B981' }}>{application.profiles?.level || 'Explorer'}</span>
              </span>
            </div>

            <div className="cm-member-card-footer-row" style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                Roll Number: <strong style={{ color: '#fff' }}>{application.roll_number}</strong>
              </div>
              <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <i className="fas fa-check-double" /> Valid
              </div>
            </div>
          </div>
          <div className="cm-member-card-logo"><span>NOVA</span></div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Go to NOVA Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyId;
