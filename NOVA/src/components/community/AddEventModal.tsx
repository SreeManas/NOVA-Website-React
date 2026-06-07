import React, { useState } from 'react';
import { supabase } from '../../services/supabase/supabaseClient';
import './AddEventModal.css';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('tech-meetup');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [tags, setTags] = useState('');
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

      const { error: dbError } = await supabase.from('events').insert({
        title,
        description,
        event_type: eventType as any,
        date,
        time,
        max_participants: maxParticipants,
        status: 'upcoming',
        tags: tagsArray,
        host_id: user.id
      });

      if (dbError) throw dbError;

      onEventAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-overlay" onClick={onClose}>
      <div className="add-event-content" onClick={e => e.stopPropagation()}>
        <button className="add-event-close" onClick={onClose}>
          <i className="fas fa-times" />
        </button>

        <h2>Add New Event</h2>
        {error && <div className="add-event-error">{error}</div>}

        <form onSubmit={handleSubmit} className="add-event-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)}>
                <option value="tech-meetup">Tech Meetup</option>
                <option value="study-circle">Study Circle</option>
                <option value="resume-review">Resume Review</option>
                <option value="mock-interview">Mock Interview</option>
                <option value="hackathon-prep">Hackathon Prep</option>
                <option value="open-source-sprint">Open Source Sprint</option>
              </select>
            </div>
            <div className="form-group">
              <label>Max Participants</label>
              <input type="number" required min="1" value={maxParticipants} onChange={e => setMaxParticipants(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" required value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" placeholder="React, Frontend, Web" value={tags} onChange={e => setTags(e.target.value)} />
          </div>

          <button type="submit" className="add-event-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
