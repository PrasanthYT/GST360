"use client";

import { useState } from "react";
import {
  User,
  Building,
  CreditCard,
  Bell,
  FileText,
  Shield,
  HelpCircle,
  Upload,
  Save,
  Percent,
  Mail,
  Phone,
  Globe,
  Image,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-6">
            <TabsList className="flex flex-col h-auto p-0 bg-transparent">
              <TabsTrigger
                value="profile"
                className={`justify-start px-4 py-2 ${
                  activeTab === "profile" ? "bg-muted" : ""
                }`}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="business"
                className={`justify-start px-4 py-2 ${
                  activeTab === "business" ? "bg-muted" : ""
                }`}
              >
                <Building className="h-4 w-4 mr-2" />
                Business
              </TabsTrigger>
              <TabsTrigger
                value="tax"
                className={`justify-start px-4 py-2 ${
                  activeTab === "tax" ? "bg-muted" : ""
                }`}
              >
                <Percent className="h-4 w-4 mr-2" />
                Tax
              </TabsTrigger>
              <TabsTrigger
                value="invoice"
                className={`justify-start px-4 py-2 ${
                  activeTab === "invoice" ? "bg-muted" : ""
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Invoice
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className={`justify-start px-4 py-2 ${
                  activeTab === "payment" ? "bg-muted" : ""
                }`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className={`justify-start px-4 py-2 ${
                  activeTab === "notifications" ? "bg-muted" : ""
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className={`justify-start px-4 py-2 ${
                  activeTab === "security" ? "bg-muted" : ""
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className={`justify-start px-4 py-2 ${
                  activeTab === "help" ? "bg-muted" : ""
                }`}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </TabsTrigger>
            </TabsList>

            <div className="hidden md:block">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Our support team is ready to assist you
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Support</p>
                      <p className="text-xs text-muted-foreground">
                        support@gst360.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone Support</p>
                      <p className="text-xs text-muted-foreground">
                        +91 1800-123-4567
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src="/placeholder.svg?height=96&width=96"
                          alt="Profile"
                        />
                        <AvatarFallback>RA</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Change Photo
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" defaultValue="Rahul" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" defaultValue="Sharma" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="rahul.sharma@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+91 98765 43210" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferences</h3>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="ist">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ist">
                            Indian Standard Time (IST)
                          </SelectItem>
                          <SelectItem value="gmt">
                            Greenwich Mean Time (GMT)
                          </SelectItem>
                          <SelectItem value="est">
                            Eastern Standard Time (EST)
                          </SelectItem>
                          <SelectItem value="pst">
                            Pacific Standard Time (PST)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode for the application
                        </p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>
                    Manage your business information and branding
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-24 w-24 rounded-md border flex items-center justify-center bg-muted">
                        <Image className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input
                          id="business-name"
                          defaultValue="ABC Enterprises"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="business-type">Business Type</Label>
                          <Select defaultValue="private">
                            <SelectTrigger id="business-type">
                              <SelectValue placeholder="Select Business Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">
                                Private Limited
                              </SelectItem>
                              <SelectItem value="public">
                                Public Limited
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnership
                              </SelectItem>
                              <SelectItem value="proprietorship">
                                Proprietorship
                              </SelectItem>
                              <SelectItem value="llp">LLP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select defaultValue="retail">
                            <SelectTrigger id="industry">
                              <SelectValue placeholder="Select Industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">
                                Manufacturing
                              </SelectItem>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="technology">
                                Technology
                              </SelectItem>
                              <SelectItem value="healthcare">
                                Healthcare
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input
                            id="website"
                            defaultValue="https://www.abcenterprises.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Business Address</h3>

                    <div className="space-y-2">
                      <Label htmlFor="address-line1">Address Line 1</Label>
                      <Input
                        id="address-line1"
                        defaultValue="123, Business Park"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address-line2">Address Line 2</Label>
                      <Input
                        id="address-line2"
                        defaultValue="Sector 5, CBD Belapur"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" defaultValue="Navi Mumbai" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select defaultValue="mh">
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mh">Maharashtra</SelectItem>
                            <SelectItem value="dl">Delhi</SelectItem>
                            <SelectItem value="ka">Karnataka</SelectItem>
                            <SelectItem value="tn">Tamil Nadu</SelectItem>
                            <SelectItem value="gj">Gujarat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input id="pincode" defaultValue="400614" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tax" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Settings</CardTitle>
                  <CardDescription>
                    Configure your tax information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Tax Identification</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input id="gstin" defaultValue="27AABCU9603R1ZX" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pan">PAN</Label>
                        <Input id="pan" defaultValue="AABCU9603R" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-regime">Tax Regime</Label>
                      <Select defaultValue="regular">
                        <SelectTrigger id="tax-regime">
                          <SelectValue placeholder="Select Tax Regime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">
                            Regular Scheme
                          </SelectItem>
                          <SelectItem value="composition">
                            Composition Scheme
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Default Tax Rates</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="default-gst">Default GST Rate</Label>
                        <Select defaultValue="18">
                          <SelectTrigger id="default-gst">
                            <SelectValue placeholder="Select GST Rate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="default-cess">Default Cess</Label>
                        <Select defaultValue="0">
                          <SelectTrigger id="default-cess">
                            <SelectValue placeholder="Select Cess Rate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="1">1%</SelectItem>
                            <SelectItem value="2">2%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      E-Invoicing Settings
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="e-invoicing">Enable E-Invoicing</Label>
                        <p className="text-sm text-muted-foreground">
                          Generate IRN for all applicable invoices
                        </p>
                      </div>
                      <Switch id="e-invoicing" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-e-invoicing">
                          Auto-generate E-Invoices
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically generate e-invoices when creating
                          invoices
                        </p>
                      </div>
                      <Switch id="auto-e-invoicing" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="invoice" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>
                    Customize your invoice appearance and defaults
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Invoice Numbering</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                        <Input id="invoice-prefix" defaultValue="INV-" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="next-number">Next Invoice Number</Label>
                        <Input id="next-number" defaultValue="00001" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-increment">
                          Auto Increment Invoice Numbers
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically increment invoice numbers for new
                          invoices
                        </p>
                      </div>
                      <Switch id="auto-increment" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Default Terms</h3>

                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">
                        Default Payment Terms
                      </Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="payment-terms">
                          <SelectValue placeholder="Select Payment Terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Due on Receipt</SelectItem>
                          <SelectItem value="15">Net 15</SelectItem>
                          <SelectItem value="30">Net 30</SelectItem>
                          <SelectItem value="45">Net 45</SelectItem>
                          <SelectItem value="60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invoice-notes">
                        Default Invoice Notes
                      </Label>
                      <Textarea
                        id="invoice-notes"
                        placeholder="Enter default notes to appear on invoices"
                        defaultValue="Thank you for your business. Payment is due within the specified terms."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Invoice Appearance</h3>

                    <div className="space-y-2">
                      <Label htmlFor="invoice-theme">Invoice Theme</Label>
                      <Select defaultValue="modern">
                        <SelectTrigger id="invoice-theme">
                          <SelectValue placeholder="Select Invoice Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="professional">
                            Professional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-logo">Show Logo on Invoices</Label>
                        <p className="text-sm text-muted-foreground">
                          Display your business logo on all invoices
                        </p>
                      </div>
                      <Switch id="show-logo" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>
                    Configure payment methods and options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Methods</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="cash">Cash</Label>
                          <p className="text-sm text-muted-foreground">
                            Accept cash payments
                          </p>
                        </div>
                        <Switch id="cash" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="bank-transfer">Bank Transfer</Label>
                          <p className="text-sm text-muted-foreground">
                            Accept bank transfers
                          </p>
                        </div>
                        <Switch id="bank-transfer" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="upi">UPI</Label>
                          <p className="text-sm text-muted-foreground">
                            Accept UPI payments
                          </p>
                        </div>
                        <Switch id="upi" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="credit-card">Credit/Debit Card</Label>
                          <p className="text-sm text-muted-foreground">
                            Accept card payments
                          </p>
                        </div>
                        <Switch id="credit-card" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="cheque">Cheque</Label>
                          <p className="text-sm text-muted-foreground">
                            Accept cheque payments
                          </p>
                        </div>
                        <Switch id="cheque" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Bank Account Details
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input id="account-name" defaultValue="ABC Enterprises" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input id="account-number" defaultValue="1234567890" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code</Label>
                        <Input id="ifsc" defaultValue="SBIN0001234" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Bank Name</Label>
                        <Input
                          id="bank-name"
                          defaultValue="State Bank of India"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input id="branch" defaultValue="CBD Belapur" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">UPI Details</h3>

                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" defaultValue="abcenterprises@sbi" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-qr">
                          Show QR Code on Invoices
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Display UPI QR code on invoices for easy payments
                        </p>
                      </div>
                      <Switch id="show-qr" defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="invoice-email">
                            Invoice Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for new invoices
                          </p>
                        </div>
                        <Switch id="invoice-email" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="payment-email">
                            Payment Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for payments
                          </p>
                        </div>
                        <Switch id="payment-email" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reminder-email">
                            Payment Reminders
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email reminders for overdue payments
                          </p>
                        </div>
                        <Switch id="reminder-email" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="gst-email">
                            GST Filing Reminders
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email reminders for GST filing deadlines
                          </p>
                        </div>
                        <Switch id="gst-email" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">SMS Notifications</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="invoice-sms">
                            Invoice Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive SMS notifications for new invoices
                          </p>
                        </div>
                        <Switch id="invoice-sms" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="payment-sms">
                            Payment Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive SMS notifications for payments
                          </p>
                        </div>
                        <Switch id="payment-sms" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reminder-sms">
                            Payment Reminders
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive SMS reminders for overdue payments
                          </p>
                        </div>
                        <Switch id="reminder-sms" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      In-App Notifications
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="all-notifications">
                            All Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Enable all in-app notifications
                          </p>
                        </div>
                        <Switch id="all-notifications" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sound">Notification Sounds</Label>
                          <p className="text-sm text-muted-foreground">
                            Play sounds for in-app notifications
                          </p>
                        </div>
                        <Switch id="sound" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <Button variant="outline" className="w-full md:w-auto">
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Two-Factor Authentication
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">
                          Enable Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-logout">Auto Logout</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out after period of inactivity
                          </p>
                        </div>
                        <Switch id="auto-logout" defaultChecked />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logout-time">Logout After</Label>
                        <Select defaultValue="30">
                          <SelectTrigger id="logout-time">
                            <SelectValue placeholder="Select Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full md:w-auto">
                      Log Out All Other Devices
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>Get help with using GST360</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Support Options</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Email Support
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                support@gst360.com
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Response time: 24 hours
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-3">
                              <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Phone Support
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                +91 1800-123-4567
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Mon-Fri, 9 AM - 6 PM IST
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Send a Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Describe your issue or question"
                        className="min-h-[150px]"
                      />
                    </div>

                    <Button className="w-full md:w-auto">Submit</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Frequently Asked Questions
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          question: "How do I generate an e-invoice?",
                          answer:
                            "Navigate to the Invoices section, create a new invoice, and click on 'Generate E-Invoice' button after filling all the required details.",
                        },
                        {
                          question: "How can I file my GST returns?",
                          answer:
                            "Go to the GST Filing section, select the return type and period, review the auto-populated data, and click on 'File Return'.",
                        },
                        {
                          question: "How do I add a new product to inventory?",
                          answer:
                            "Navigate to Inventory section, click on 'Add Product', fill in the product details including HSN code, and save.",
                        },
                        {
                          question: "Can I import data from other software?",
                          answer:
                            "Yes, go to Settings > Data Import/Export, select the import option, and follow the instructions to import your data.",
                        },
                      ].map((faq, i) => (
                        <div key={i} className="rounded-lg border p-4">
                          <h4 className="text-sm font-medium">
                            {faq.question}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
