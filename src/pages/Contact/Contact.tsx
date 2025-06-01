import React, { useState } from 'react';
import { Email, Person, Message } from '@mui/icons-material';
import { useContactContext } from '../../Context/ContactContext/ContactContext';

const Contact: React.FC = () => {
  const { submitContact } = useContactContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await submitContact(formData.name, formData.email, formData.message);
      setFormData({ name: '', email: '', message: '' });
      alert('Message sent successfully!');
    } catch (err: any) {
      setError(err.message || 'Error submitting message');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="flex items-center mb-2">
            <Person className="mr-2" /> Name
          </label>
      <input
  type="text"
  id="name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Your name"
  className="w-full border rounded px-3 py-2"
  required
/>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="flex items-center mb-2">
            <Email className="mr-2" /> Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="flex items-center mb-2">
            <Message className="mr-2" /> Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            className="w-full border rounded px-3 py-2"
            rows={5}
            required
          />
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;