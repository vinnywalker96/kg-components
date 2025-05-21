"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null })
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !message) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields"
      })
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: null })
    
    try {
      const supabase = createClient()
      // Store the contact message in Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          subject,
          message
        })
      
      if (error) {
        throw error
      }
      
      // Reset form
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
      
      setSubmitStatus({
        type: "success",
        message: "We&apos;ve received your message and will get back to you soon!"
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus({
        type: "error",
        message: "There was a problem sending your message. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Have questions or need assistance? We&apos;re here to help!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-muted-foreground">
                  123 Electronics Way<br />
                  Tech City, TC 12345<br />
                  United States
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">
                  support@kg-components.com
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-muted-foreground">
                  +1 (555) 123-4567
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Hours</h3>
                <p className="text-muted-foreground">
                  Monday - Friday: 9AM - 6PM EST<br />
                  Saturday: 10AM - 4PM EST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  
                  {submitStatus.type && (
                    <div className={`text-sm ${
                      submitStatus.type === "success" ? "text-green-600" : "text-red-600"
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

