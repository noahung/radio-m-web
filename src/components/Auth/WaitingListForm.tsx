import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import NeumorphicButton from '../UI/NeumorphicButton';
import Header from '../Layout/Header';
import BottomNavigation from '../Layout/BottomNavigation';

const WaitingListForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    willingness_to_pay: '$3'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('waiting_list')
        .insert([formData]);

      if (error) throw error;
      
      setSubmitMessage('Thank you for joining the waiting list!');
      setFormData({ name: '', email: '', country: '', willingness_to_pay: '$3' });
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <Header title="Join Waiting List" />      <main className="px-6 py-6 pb-24">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Coming Soon: The Ultimate Burmese Music Experience</h1>
          <p className="text-gray-300 mb-3">Thar Htet is working hard to build Myanmar's largest digital music catalog, featuring thousands of carefully curated Burmese songs across all genres.</p>
          <p className="text-gray-300 mb-3">Get exclusive early access to:</p>
          <ul className="text-gray-300 mb-6 space-y-2">
            <li>✨ Thousands of traditional and modern Burmese songs</li>
            <li>🎵 High-quality, ad-free streaming</li>
            <li>📱 Offline listening on mobile devices</li>
            <li>🎧 Curated playlists and personalised recommendations</li>
          </ul>
        </div>

        <div className="w-full max-w-md p-6 rounded-xl bg-[#1e293b] shadow-xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Join the Waiting List</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              id="name"
              required
              className="w-full p-2 rounded bg-[#334155] text-white border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              required
              className="w-full p-2 rounded bg-[#334155] text-white border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <input
              type="text"
              id="country"
              required
              className="w-full p-2 rounded bg-[#334155] text-white border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="willingness_to_pay" className="block text-sm font-medium text-gray-300 mb-1">
              How Much Are You Willing to Pay MONTHLY for Thousands of Myanmar Songs catalog and Player?
            </label>
            <select
              id="willingness_to_pay"
              required
              className="w-full p-2 rounded bg-[#334155] text-white border border-[#475569] focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.willingness_to_pay}
              onChange={(e) => setFormData({ ...formData, willingness_to_pay: e.target.value })}
            >
              <option value="$1">$1</option>
              <option value="$3">$3</option>
              <option value="$5">$5</option>
            </select>
          </div>

          <div className="mt-6">            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              <NeumorphicButton
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </NeumorphicButton>
            </button>
          </div>          {submitMessage && (
            <p className="mt-4 text-center text-sm font-medium text-emerald-400">
              {submitMessage}
            </p>
          )}
        </form>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default WaitingListForm;
