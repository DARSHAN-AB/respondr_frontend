import { ScrollToTop } from "@/components/scroll-to-top"
import { AnimatedSection } from "@/components/animated-section"

export default function CareersPage() {
  // const jobOpenings = [
  //   {
  //     title: "Emergency Response Specialist",
  //     department: "Operations",
  //     location: "Remote",
  //     type: "Full-time",
  //   },
  //   {
  //     title: "Mobile App Developer",
  //     department: "Engineering",
  //     location: "Remote",
  //     type: "Full-time",
  //   },
  //   {
  //     title: "UX/UI Designer",
  //     department: "Design",
  //     location: "India, Karnataka",
  //     type: "Full-time",
  //   },
  //   {
  //     title: "Customer Support Representative",
  //     department: "Support",
  //     location: "India, Karnataka",
  //     type: "Full-time",
  //   },
  //   {
  //     title: "Marketing Specialist",
  //     department: "Marketing",
  //     location: "Remote",
  //     type: "Full-time",
  //   },
  //   {
  //     title: "Data Scientist",
  //     department: "Analytics",
  //     location: "Remote",
  //     type: "Full-time",
  //   },
  // ]

  return (
    <main className="flex min-h-screen flex-col">
      <ScrollToTop />

      {/* Hero Section */}
      <section className="w-full py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Help us revolutionize emergency response systems and save lives through technology.
          </p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="w-full py-20 bg-white">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Join Respondr?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Meaningful Work</h3>
                <p className="text-gray-600">
                  Join a team that's making a real difference in people's lives every day.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-gray-600">
                  Work with cutting-edge technology and contribute to innovative solutions.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Great Team</h3>
                <p className="text-gray-600">
                  Be part of a diverse, passionate team that values collaboration and growth.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 bg-gray-50">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Benefits & Perks</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Competitive salary and equity packages</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Comprehensive health insurance</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Flexible work arrangements and remote options</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Generous paid time off and parental leave</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Professional development and learning opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Wellness programs and gym membership reimbursement</span>
                  </li>
                  {/* <li className="flex items-start">
                    <svg
                      className="h-6 w-6 text-red-600 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">401(k) matching program</span>
                  </li> */}
                </ul>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/team-work.jpg?height=400&width=600"
                  alt="Team working together"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Current Openings Section */}
      <section className="w-full py-20 bg-white">
        <AnimatedSection>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Current Openings</h2>
            <p className="text-gray-600 text-lg mb-4">
              We are not hiring currently.
            </p>
            <p className="text-gray-600 text-lg">
              If you're interested in working with us, feel free to reach out through the Contact page.
            </p>
            {/* 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {jobOpenings.map((job, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {job.department}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {job.location}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    We're looking for talented individuals to join our team and help us revolutionize emergency response systems.
                  </p>
                  <a href="#" className="text-red-600 hover:text-red-800 font-medium inline-flex items-center">
                    View Details
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
            */}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-red-600 text-white">
        <AnimatedSection>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Don't See a Perfect Fit?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in
              mind for future opportunities.
            </p>
            <a
              href="/contact"
              className="bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-lg transition duration-300 inline-block"
            >
              Contact Us
            </a>
          </div>
        </AnimatedSection>
      </section>
    </main>
  )
}