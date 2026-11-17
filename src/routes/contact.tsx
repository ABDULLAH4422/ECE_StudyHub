import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <PageHeader
        category="Directory & Inquiries"
        title="Contact Department"
        description="Get in touch with the Department Office, Head of Department, Academic Coordinators, or Administrative Staff."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Office Information
              </h2>
              <p className="text-xs text-muted-foreground">
                Official departmental contact channels and physical campus location.
              </p>
            </div>

            <div className="space-y-3.5">
              <Card className="border border-border/80 bg-card">
                <CardContent className="p-4 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <h3 className="font-semibold text-foreground">Campus Address</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Department of Electrical and Computer Engineering (ECE), 3rd Floor, ECE Building, RUET Campus, Kazla, Rajshahi-6204, Bangladesh.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-card">
                <CardContent className="p-4 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <h3 className="font-semibold text-foreground">Email Communications</h3>
                    <p className="text-muted-foreground">
                      Head of Department:{" "}
                      <a href="mailto:head@ece.ruet.ac.bd" className="text-foreground hover:underline font-medium">
                        head@ece.ruet.ac.bd
                      </a>
                    </p>
                    <p className="text-muted-foreground">
                      Academic Inquiries:{" "}
                      <a href="mailto:info@ece.ruet.ac.bd" className="text-foreground hover:underline font-medium">
                        info@ece.ruet.ac.bd
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-card">
                <CardContent className="p-4 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-md bg-secondary text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <h3 className="font-semibold text-foreground">Telephone & Working Hours</h3>
                    <p className="text-muted-foreground">Direct/Fax: +88-0721-751055</p>
                    <p className="text-muted-foreground">PABX: +88-0721-750742-3 (ext. 653)</p>
                    <p className="text-muted-foreground">Hours: Sunday – Thursday (09:00 – 17:00 BST)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7">
            <Card className="border border-border/80 bg-card">
              <CardHeader className="bg-muted/30 border-b border-border/60 py-4 px-5">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Send an Academic Inquiry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-xs">
                {submitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-secondary text-primary mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">Inquiry Received</p>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Thank you, {name}. Your academic inquiry has been forwarded to the department administrative office.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setEmail("");
                        setSubject("");
                        setMessage("");
                      }}
                      className="text-xs mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs">Your Full Name</Label>
                        <Input
                          id="name"
                          required
                          placeholder="e.g. Abdullah Al Mamun"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs">Subject Category</Label>
                      <Input
                        id="subject"
                        required
                        placeholder="Curriculum / Admission / General Inquiry"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="msg" className="text-xs">Message</Label>
                      <Textarea
                        id="msg"
                        required
                        rows={5}
                        placeholder="Please write your detailed inquiry..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-xs resize-none"
                      />
                    </div>

                    <Button type="submit" size="sm" className="w-full gap-2 font-medium">
                      <Send className="w-3.5 h-3.5" /> Submit Inquiry to Department
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
