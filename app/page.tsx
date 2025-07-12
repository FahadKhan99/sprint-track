import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Features } from "@/constants/features";
import CompanyCarousel from "@/components/CompanyCarousel";
import AccordionFAQs from "@/components/AccordionFAQs";

const Home = () => {
  return (
    <main className="min-h-screen">
      <section className="container mx-auto py-32 text-center">
        <h1 className="text-6xl sm:text-4xl lg:text-8xl gap-4 font-extrabold gradient-title flex flex-col">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            With{" "}
            {/* <Image
              src="/logo2.png"
              alt="logo"
              height={80}
              width={400}
              className="h-14 sm:h-24 object-contain w-auto"
            /> */}
            <span className="backdrop-blur-md bg-white/75 border border-white/10 rounded-2xl px-6 py-3 shadow-lg font-black bg-gradient-to-r from-purple-500 via-indigo-400 to-sky-300 bg-clip-text text-transparent">
              SprintTrack
            </span>
          </span>
        </h1>

        <p className="font-semibold text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Empower your team with our intuitive project management solution.
        </p>
        <div>
          <Link href="/onboarding">
            <Button size="lg" className="mr-3 cursor-pointer">
              Get Started <ChevronRight size={18} />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="secondary"
              className="mr-3 cursor-pointer"
            >
              Learned More
            </Button>
          </Link>
        </div>
      </section>

      <section
        id="features"
        className="py-20 bg-gray-900/40 backdrop-blur-xl border border-gray-500/30 shadow-xl ring-1 ring-white/10 rounded-2xl px-5"
      >
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Features.map(({ title, description, icon: Icon }, index) => (
              <Card key={index} className="bg-gray-800 shadow-2xl">
                <CardContent>
                  <Icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl font-semibold mb-2">{title}</h4>
                  <p className="text-gray-300">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted By Industry Leaders
          </h3>
          <CompanyCarousel />
        </div>
      </section>

      <section className="py-20 bg-gray-900/40 backdrop-blur-xl border border-gray-500/30 shadow-xl ring-1 ring-white/10 rounded-2xl px-5">
        <div className="container mx-auto max-w-3xl">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h3>

          <AccordionFAQs />
        </div>
      </section>

      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6 dark:text-white">
            Ready to Transform Your Workflow?
          </h2>

          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto dark:text-gray-300">
            Join thousands of teams using{" "}
            <span className="font-semibold dark:text-white">sprintTrack</span>{" "}
            to streamline their projects and boost productivity.
          </p>

          <Link href="/onboarding">
            <Button
              size="lg"
              className="group transition-transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              <span className="flex items-center">
                Start for Free
                <ChevronRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
