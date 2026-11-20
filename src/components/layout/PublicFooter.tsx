import React from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, ShieldCheck, FileText } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-muted border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Institutional Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm leading-tight">
                  ECE StudyHub
                </h3>
                <p className="text-xs text-muted-foreground">
                  RUET Academic Portal
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Department of Electrical and Computer Engineering, Rajshahi University of Engineering & Technology.
            </p>

            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-background border">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">BAETE Accredited</span>
            </div>
          </div>

          {/* Department Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase text-foreground">
              Department
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/vision-mission" className="text-muted-foreground hover:text-foreground">
                  Vision & Mission
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="text-muted-foreground hover:text-foreground">
                  Faculty
                </Link>
              </li>
              <li>
                <Link to="/alumni" className="text-muted-foreground hover:text-foreground">
                  Alumni
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Research Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase text-foreground">
              Academics
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/curriculum" className="text-muted-foreground hover:text-foreground">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/notes" className="text-muted-foreground hover:text-foreground">
                  Study Notes
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="text-muted-foreground hover:text-foreground">
                  Calculators
                </Link>
              </li>
              <li>
                <Link to="/cgpa-calculator" className="text-muted-foreground hover:text-foreground">
                  CGPA Calculator
                </Link>
              </li>
              <li>
                <Link to="/simulators" className="text-muted-foreground hover:text-foreground">
                  Simulators
                </Link>
              </li>
              <li>
                <Link to="/focus-room" className="text-muted-foreground hover:text-foreground">
                  Focus Room
                </Link>
              </li>
              <li>
                <Link to="/study-planner" className="text-muted-foreground hover:text-foreground">
                  Study Planner
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-muted-foreground hover:text-foreground">
                  Laboratories
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-foreground">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-muted-foreground hover:text-foreground">
                  Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase text-foreground">
              Contact
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>ECE Building, RUET, Rajshahi-6204</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:head@ece.ruet.ac.bd" className="hover:text-foreground">
                  head@ece.ruet.ac.bd
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+88-0721-751055</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <div>
            © {new Date().getFullYear()} ECE Department, RUET
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/ece-undergraduate-syllabus.pdf"
              download
              className="hover:text-foreground inline-flex items-center gap-1"
            >
              <FileText className="w-3 h-3" /> Syllabus
            </a>
            <span>·</span>
            <a
              href="https://www.ece.ruet.ac.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1"
            >
              Official Site <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
