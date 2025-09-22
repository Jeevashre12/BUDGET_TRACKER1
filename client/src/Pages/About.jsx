import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="min-h-screen" style={{ paddingTop: '100px', background: 'linear-gradient(135deg, #f5f3f0 0%, #f0ede8 100%)' }}>
      <style>
        {`
          .about-icon {
            color: #5a4a42 !important;
          }
          .about-icon-bg {
            background-color: #f5f3f0 !important;
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">About Recipedia</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your culinary journey starts here. Recipedia is more than just a recipe app – 
            it's a community where food lovers discover, create, and share amazing recipes from around the world.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                We believe that cooking should be accessible, enjoyable, and inspiring for everyone. 
                Whether you're a seasoned chef or a kitchen beginner, Recipedia provides the tools 
                and community you need to explore the wonderful world of cooking.
              </p>
              <p className="text-lg text-gray-600">
                Our platform connects food enthusiasts, preserves family recipes, and celebrates 
                the diverse culinary traditions that make our world delicious.
              </p>
            </div>
            <div className="text-center">
              <img 
                src={assets.logo} 
                alt="Recipedia Logo" 
                className="w-64 h-64 mx-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Makes Us Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 about-icon-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 about-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Discover Recipes</h3>
              <p className="text-gray-600">
                Browse through thousands of recipes from home cooks and professional chefs worldwide. 
                Find your next favorite dish with our intuitive search and filtering system.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 about-icon-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 about-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Share & Connect</h3>
              <p className="text-gray-600">
                Share your own recipes with the community and connect with fellow food lovers. 
                Build your personal recipe collection and inspire others with your culinary creations.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 about-icon-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 about-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Our user-friendly interface makes it simple to find, save, and follow recipes. 
                Step-by-step instructions and helpful tips ensure your cooking success every time.
              </p>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="rounded-2xl shadow-lg p-8 mb-12 text-white" style={{ background: 'linear-gradient(45deg, #5a4a42 0%, #3d2f2a 100%)' }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Be part of a growing community of food enthusiasts who share your passion for cooking. 
              From traditional family recipes to innovative culinary experiments, there's always something new to discover.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-gray-100">Recipes Shared</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-gray-100">Active Cooks</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-gray-100">Countries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 about-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 about-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality First</h3>
                  <p className="text-gray-600">We curate and verify recipes to ensure they meet our high standards for taste and reliability.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 about-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 about-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Driven</h3>
                  <p className="text-gray-600">Our platform thrives on the contributions and feedback from our amazing community of cooks.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 about-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 about-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Accessibility</h3>
                  <p className="text-gray-600">We believe everyone should have access to great recipes, regardless of skill level or dietary restrictions.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 about-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 about-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Innovation</h3>
                  <p className="text-gray-600">We continuously improve our platform with new features and tools to enhance your cooking experience.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 about-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 about-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Cultural Diversity</h3>
                  <p className="text-gray-600">We celebrate and preserve culinary traditions from cultures around the world.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 about-icon-bg rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 about-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Sustainability</h3>
                  <p className="text-gray-600">We promote sustainable cooking practices and encourage the use of local, seasonal ingredients.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Start Cooking?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of food lovers who are already discovering amazing recipes on Recipedia.
          </p>
          <button className="text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(45deg, #5a4a42 0%, #3d2f2a 100%)' }}>
            Explore Recipes Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default About




