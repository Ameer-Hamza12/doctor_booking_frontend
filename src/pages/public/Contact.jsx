import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Calendar,
  CheckCircle,
  Shield,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import MainNavbar from "../../components/navbar/MainNavbar";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 8pm",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@doctorbooking.com",
      description: "Response within 24 hours",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Health Street",
      description: "Medical City, HC 12345",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Clock,
      title: "Hours",
      details: "24/7 Support",
      description: "Emergency support available",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "Simply create an account, search for doctors, and select your preferred time slot."
    },
    {
      question: "Are all doctors verified?",
      answer: "Yes, every doctor on our platform undergoes thorough verification and credential checks."
    },
    {
      question: "Can I cancel or reschedule appointments?",
      answer: "Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time."
    },
    {
      question: "Is my medical information secure?",
      answer: "We use bank-level encryption and comply with all healthcare privacy regulations."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                We're Here to Help
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Get in Touch
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  With Our Team
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Have questions, feedback, or need support? Our team is ready to assist you. 
                Reach out through any channel below.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className={`w-16 h-16 ${info.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                  <info.icon className={`w-8 h-8 ${info.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                <div className="text-lg font-medium text-gray-700 mb-2">{info.details}</div>
                <p className="text-gray-500 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600 mb-8">We typically respond within 24 hours</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="doctor">Doctor Registration</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Send className="w-5 h-5 mr-3" />
                  Send Message
                </button>
              </form>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Main Office</div>
                      <div className="text-gray-600">123 Health Street, Medical City</div>
                      <div className="text-gray-600">Healthcare District, HC 12345</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Business Hours</div>
                      <div className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</div>
                      <div className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</div>
                      <div className="text-gray-600">Sunday: Emergency Support Only</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-purple-600 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Emergency Support</div>
                      <div className="text-gray-600">Available 24/7 for urgent medical inquiries</div>
                      <div className="text-blue-600 font-medium mt-2">+1 (555) 911-HELP</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Section */}
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/faq" 
                  className="inline-flex items-center text-blue-600 font-medium mt-6 hover:text-blue-700"
                >
                  View all FAQs
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Support CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-12 md:p-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Our live support team is available 24/7 for urgent medical inquiries and emergencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+15551234567" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-3" />
                Call Now: (555) 123-4567
              </a>
              <Link 
                to="/emergency" 
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Emergency Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;