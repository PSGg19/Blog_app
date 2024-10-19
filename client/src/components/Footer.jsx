import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  BsGithub,
  BsTwitter,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        {/* Grid layout for responsive footer */}
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          
          {/* Logo Section - Link to Home */}
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text:lg sm:text-xl font-semibold dark:text-white"
            >
              {/* Gradient background for the logo */}
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Prahlad's
              </span>
              Blogs
            </Link>
          </div>

          {/* Footer Links Section with multiple categories */}
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            {/* 'About' Section with links */}
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* External link to 100js projects */}
                  100js Project
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Link to internal 'About' page */}
                  Prahlad's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* 'Follow Us' Section with social media links */}
            <div>
              <Footer.Title title="follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/PSGg19"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* External link to GitHub profile */}
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/prahlad-sharan/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* External link to LinkedIn profile */}
                  LinkedIn
                </Footer.Link>
                <Footer.Link
                  href="https://discord.com/guild-discvery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* External link to Discord community */}
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* 'Legal' Section with privacy policy and terms & conditions links */}
            <div>
              <Footer.Title title="legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        {/* Footer Divider to separate sections */}
        <Footer.Divider />

        {/* Footer Copyright and Social Media Icons */}
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Prahlad's Blog"
            year={new Date().getFullYear()} // Dynamically set the year
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            {/* Social Media Icons for Facebook, Instagram, Twitter, GitHub, and LinkedIn */}
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
