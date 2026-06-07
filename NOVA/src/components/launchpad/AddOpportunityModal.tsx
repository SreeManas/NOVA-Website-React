import React, { useState } from 'react';
import { supabase } from '../../services/supabase/supabaseClient';
import './AddOpportunityModal.css';
import { OpportunityCategory } from '../../domain/models/LaunchpadModels';

interface AddOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({ isOpen, onClose, onAdded }) => {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('hackathon');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [location, setLocation] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      const { error: dbError } = await supabase.from('opportunities').insert({
        author_id: user.id,
        title,
        organizer,
        category,
        description,
        deadline: new Date(deadline).toISOString(),
        apply_url: applyUrl,
        location,
        eligibility,
        tags: tagsArray,
        is_featured: isFeatured
      });

      if (dbError) throw dbError;

      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-opp-overlay" onClick={onClose}>
      <div className="add-opp-content" onClick={e => e.stopPropagation()}>
        <button className="add-opp-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>

        <h2>Add Opportunity</h2>
        {error && <div className="add-opp-error">{error}</div>}

        <form onSubmit={handleSubmit} className="add-opp-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Organizer</label>
              <input type="text" required value={organizer} onChange={e => setOrganizer(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as OpportunityCategory)}>
                <option value="hackathon">Hackathon</option>
                <option value="internship">Internship</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
                <option value="scholarship">Scholarship</option>
                <option value="open-source">Open Source</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Deadline</label>
              <input type="date" required value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" required value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Apply URL</label>
            <input type="url" required value={applyUrl} onChange={e => setApplyUrl(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Eligibility</label>
            <input type="text" required value={eligibility} onChange={e => setEligibility(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" placeholder="React, Python, 1st Year" value={tags} onChange={e => setTags(e.target.value)} />
          </div>

          <div className="form-checkbox">
            <label>
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
              Mark as Featured Opportunity
            </label>
          </div>

          <button type="submit" className="add-opp-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Opportunity'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOpportunityModal;
