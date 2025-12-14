import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Sweet Doodles Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">🍬</div>
        <div className="absolute top-20 right-20 text-5xl animate-pulse">🍭</div>
        <div className="absolute bottom-20 left-20 text-7xl animate-bounce-slow">🍫</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-pulse">🧁</div>
        <div className="absolute top-1/3 left-1/4 text-5xl animate-bounce-slow">🍩</div>
        <div className="absolute top-2/3 right-1/4 text-6xl animate-pulse">🍪</div>
        <div className="absolute top-1/2 left-10 text-5xl animate-bounce-slow">🍰</div>
        <div className="absolute top-1/4 right-1/3 text-6xl animate-pulse">🎂</div>
        <div className="absolute bottom-1/3 left-1/3 text-5xl animate-bounce-slow">🍮</div>
        <div className="absolute top-3/4 right-20 text-6xl animate-pulse">🍡</div>
        <div className="absolute top-40 left-1/2 text-5xl animate-bounce-slow">🍨</div>
        <div className="absolute bottom-40 right-1/3 text-6xl animate-pulse">🧇</div>
        <div className="absolute top-60 right-40 text-5xl animate-bounce-slow">🍦</div>
        <div className="absolute bottom-60 left-40 text-6xl animate-pulse">🥧</div>
        <div className="absolute top-1/4 left-1/2 text-5xl animate-bounce-slow">🍯</div>
        <div className="absolute bottom-1/4 right-1/2 text-6xl animate-pulse">🧈</div>
        <div className="absolute top-1/2 right-1/4 text-5xl animate-bounce-slow">🥮</div>
        <div className="absolute bottom-1/2 left-1/4 text-6xl animate-pulse">🍥</div>
        <div className="absolute top-16 left-1/3 text-5xl animate-bounce-slow">🍧</div>
        <div className="absolute bottom-16 right-2/3 text-6xl animate-pulse">🥠</div>
        <div className="absolute top-2/3 left-16 text-5xl animate-bounce-slow">🍢</div>
        <div className="absolute bottom-2/3 right-16 text-6xl animate-pulse">🍬</div>
        <div className="absolute top-1/3 right-1/2 text-5xl animate-bounce-slow">🍭</div>
        <div className="absolute bottom-1/3 left-1/2 text-6xl animate-pulse">🍫</div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold merriweather text-gray-900 mb-4">Get In Touch</h1>
          <p className="text-gray-600 text-lg">
            Have questions about our sweet collection? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Contact Info Section */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-white flex flex-col justify-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center">
                    <span className="text-4xl mr-3">🍬</span>
                    Contact Info
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <span className="text-2xl flex-shrink-0">📧</span>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-orange-100">contact@sweetshop.com</p>
                      <p className="text-orange-100">support@sweetshop.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <span className="text-2xl flex-shrink-0">📱</span>
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-orange-100">+1 (555) 123-4567</p>
                      <p className="text-orange-100">+1 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <span className="text-2xl flex-shrink-0">📍</span>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-orange-100">123 Sweet Street</p>
                      <p className="text-orange-100">Candy City, CC 12345</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <span className="text-2xl flex-shrink-0">🕐</span>
                    <div>
                      <p className="font-semibold">Business Hours</p>
                      <p className="text-orange-100">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-orange-100">Sat - Sun: 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t border-orange-400">
                  <p className="font-semibold mb-4">Follow Us</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-2xl hover:scale-125 transition-transform">🐦</a>
                    <a href="#" className="text-2xl hover:scale-125 transition-transform">📘</a>
                    <a href="#" className="text-2xl hover:scale-125 transition-transform">📷</a>
                    <a href="#" className="text-2xl hover:scale-125 transition-transform">💬</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="p-12">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">
                    We've received your message and will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Send Message 💌
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-orange-600 mb-2">🚚 What's the delivery time?</h3>
              <p className="text-gray-600">We offer fast delivery within 2-3 business days for local orders and 5-7 days for international orders.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-orange-600 mb-2">💳 What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept credit cards, debit cards, PayPal, and various other digital payment methods.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-orange-600 mb-2">🔄 Can I return products?</h3>
              <p className="text-gray-600">Yes, we have a 30-day return policy for unopened products. Contact us for more details.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold text-orange-600 mb-2">🎁 Do you offer bulk orders?</h3>
              <p className="text-gray-600">Absolutely! Contact us for special pricing on bulk and wholesale orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
