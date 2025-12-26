import { 
  Target, 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Calendar,
  ArrowRight,
  Globe,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import MainNavbar from '../../components/navbar/MainNavbar';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Every decision we make prioritizes patient well-being and satisfaction.",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We maintain complete transparency in doctor credentials and pricing.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Making quality healthcare accessible to everyone, everywhere.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to excellence in healthcare delivery and technology.",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "Started with a vision to transform healthcare access" },
    { year: "2021", title: "10K Patients", description: "Served our first 10,000 satisfied patients" },
    { year: "2022", title: "500+ Doctors", description: "Onboarded 500+ verified medical specialists" },
    { year: "2023", title: "50K+ Users", description: "Expanded to serve 50,000+ users nationwide" },
    { year: "2024", title: "Award Winning", description: "Received Healthcare Innovation Award" }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Medical Director",
      bio: "Board-certified physician with 15+ years of clinical experience",
      avatar: "SJ",
      color: "bg-blue-500"
    },
    {
      name: "Michael Chen",
      role: "Technology Lead",
      bio: "Healthcare technology specialist with expertise in telemedicine",
      avatar: "MC",
      color: "bg-green-500"
    },
    {
      name: "Lisa Rodriguez",
      role: "Patient Experience",
      bio: "Dedicated to ensuring exceptional care for every patient",
      avatar: "LR",
      color: "bg-purple-500"
    },
    {
      name: "David Wilson",
      role: "Operations Director",
      bio: "Healthcare administration expert with 20+ years experience",
      avatar: "DW",
      color: "bg-amber-500"
    }
  ];

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
                <Target className="w-4 h-4 mr-2" />
                Our Mission & Vision
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Transforming Healthcare
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Through Technology
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We're on a mission to make quality healthcare accessible, affordable, and convenient 
                for everyone. By connecting patients with trusted medical professionals, we're building 
                a healthier future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Story
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2020 by a team of healthcare professionals and technology experts, 
                DoctorBooking emerged from a simple observation: accessing quality healthcare 
                shouldn't be complicated.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We witnessed patients struggling with long wait times, confusing appointment systems, 
                and limited access to specialists. At the same time, doctors were overwhelmed with 
                administrative tasks.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we've grown into a platform trusted by thousands of patients and hundreds 
                of medical professionals, but our core mission remains the same: to simplify 
                healthcare access for everyone.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl p-8 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-700 font-medium">Verified Doctors</div>
                  <div className="text-sm text-gray-500 mt-1">Across 50+ specialties</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
                  <div className="text-gray-700 font-medium">Patients Served</div>
                  <div className="text-sm text-gray-500 mt-1">With 98% satisfaction</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-700 font-medium">Support Available</div>
                  <div className="text-sm text-gray-500 mt-1">Always here to help</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="text-4xl font-bold text-amber-600 mb-2">10M+</div>
                  <div className="text-gray-700 font-medium">Appointments</div>
                  <div className="text-sm text-gray-500 mt-1">Successfully booked</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
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
              Our Journey
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Milestones in our journey to transform healthcare
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-teal-500"></div>
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative mb-12 ${index % 2 === 0 ? 'pr-12 md:pr-0 md:pl-12' : 'pl-12 md:pl-0 md:pr-12'} ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                {/* Timeline dot */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our Leadership
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The passionate team driving healthcare innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`h-40 ${member.color} flex items-center justify-center`}>
                  <div className="text-4xl font-bold text-white">{member.avatar}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-blue-600 font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
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
              Join Our Mission
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a patient seeking care or a doctor looking to expand your practice, 
              join us in revolutionizing healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup?role=patient" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Become a Patient
                <ArrowRight className="w-5 h-5 ml-3" />
              </Link>
              <Link 
                to="/signup?role=doctor" 
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Join as Doctor
                <Users className="w-5 h-5 mr-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;