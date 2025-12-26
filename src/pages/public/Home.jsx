import { Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  Search, 
  Star, 
  Heart, 
  Stethoscope, 
  Users, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Phone,
  MapPin,
  Award,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from "../../components/Navbar";

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Doctors",
      description: "Every professional is thoroughly vetted and board-certified.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "No more long wait times or phone calls. Book in 2 minutes.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Star,
      title: "Patient Reviews",
      description: "Real feedback from real patients to help you choose.",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Treatment plans tailored to your specific health needs.",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Calendar,
      title: "Easy Rescheduling",
      description: "Change or cancel appointments with just a few clicks.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Search,
      title: "Find Specialists",
      description: "Search and filter by specialty, location, and availability.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  const specialties = [
    { name: "Cardiology", icon: Heart, patients: "10K+", color: "text-red-600", bgColor: "bg-red-50" },
    { name: "Dermatology", icon: Shield, patients: "8K+", color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "Pediatrics", icon: Users, patients: "15K+", color: "text-green-600", bgColor: "bg-green-50" },
    { name: "Orthopedics", icon: Award, patients: "12K+", color: "text-purple-600", bgColor: "bg-purple-50" },
    { name: "Neurology", icon: Activity, patients: "7K+", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    { name: "Dentistry", icon: CheckCircle, patients: "9K+", color: "text-teal-600", bgColor: "bg-teal-50" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "Found the perfect specialist in minutes. The booking process was seamless!",
      rating: 5,
      avatar: "SJ",
      location: "New York"
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "This platform has helped me manage my appointments efficiently. Great tool!",
      rating: 5,
      avatar: "MC",
      location: "Los Angeles"
    },
    {
      name: "Robert Wilson",
      role: "Patient",
      content: "Easy to use and saved me hours of phone calls. Highly recommended!",
      rating: 5,
      avatar: "RW",
      location: "Chicago"
    }
  ];

  const doctors = [
    {
      name: "Dr. Sarah Miller",
      specialization: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      patients: "2.5k",
      avatarColor: "bg-pink-500"
    },
    {
      name: "Dr. James Wilson",
      specialization: "Neurologist",
      experience: "12 years",
      rating: 4.8,
      patients: "1.8k",
      avatarColor: "bg-blue-500"
    },
    {
      name: "Dr. Lisa Parker",
      specialization: "Pediatrician",
      experience: "10 years",
      rating: 4.9,
      patients: "3.2k",
      avatarColor: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-24 md:pb-32 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Trusted by 50,000+ Patients
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  Your Health Journey
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                    Starts Here
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Connect with top-rated medical specialists, manage your health records, 
                  and book appointments instantly. Your well-being is our priority.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    to="/signup?role=patient" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
                  >
                    <Search className="w-5 h-5 mr-3" />
                    Find a Doctor
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Link>
                  
                  <Link 
                    to="/signup?role=doctor" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 rounded-xl font-bold text-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Join as Doctor
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
                    <div className="text-gray-600 text-sm">Verified Doctors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">50K+</div>
                    <div className="text-gray-600 text-sm">Happy Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">98%</div>
                    <div className="text-gray-600 text-sm">Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              {/* Right Image/Illustration */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    {doctors.map((doctor, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${doctor.avatarColor} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{doctor.name}</div>
                            <div className="text-sm text-gray-600">{doctor.specialization}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                            <span className="font-bold">{doctor.rating}</span>
                          </div>
                          <div className="text-gray-600">{doctor.patients} patients</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <div className="font-bold text-gray-900">Book Now</div>
                        <div className="text-sm text-gray-600">Instant confirmation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're revolutionizing healthcare accessibility with technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Specialties
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find the right specialist for your healthcare needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 ${specialty.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-80 transition-colors`}>
                  <specialty.icon className={`w-8 h-8 ${specialty.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{specialty.name}</h3>
                <div className="text-sm text-gray-500">{specialty.patients} patients</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/doctors" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              View all specialties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get medical care in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Sign Up", description: "Create your account in seconds", icon: Users },
              { step: "2", title: "Find & Book", description: "Browse doctors and book appointments", icon: Calendar },
              { step: "3", title: "Get Treatment", description: "Meet your doctor and receive care", icon: CheckCircle }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center p-8"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join thousands of satisfied patients and doctors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-gray-500 text-xs">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have found their perfect healthcare match
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup?role=patient" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link 
                to="/doctors" 
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-3" />
                Find Doctors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Stethoscope className="w-8 h-8 text-blue-400 mr-3" />
                <span className="text-2xl font-bold">DoctorBooking</span>
              </div>
              <p className="text-gray-400">
                Making healthcare accessible and convenient for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">For Patients</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/doctors" className="hover:text-white">Find Doctors</Link></li>
                <li><Link to="/appointments" className="hover:text-white">Book Appointments</Link></li>
                <li><Link to="/reviews" className="hover:text-white">Read Reviews</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">For Doctors</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/signup?role=doctor" className="hover:text-white">Join Platform</Link></li>
                <li><Link to="/login" className="hover:text-white">Doctor Login</Link></li>
                <li><Link to="/doctor-dashboard" className="hover:text-white">Doctor Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>123 Health Street, Medical City</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>support@doctorbooking.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} DoctorBooking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;