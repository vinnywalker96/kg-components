import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Settings | Admin Dashboard',
  description: 'Configure store settings and preferences.',
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="store-name" className="text-sm font-medium">
                    Store Name
                  </label>
                  <Input
                    id="store-name"
                    placeholder="KG-Components"
                    defaultValue="KG-Components"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="store-email" className="text-sm font-medium">
                    Store Email
                  </label>
                  <Input
                    id="store-email"
                    type="email"
                    placeholder="info@kg-components.com"
                    defaultValue="info@kg-components.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="store-phone" className="text-sm font-medium">
                    Store Phone
                  </label>
                  <Input
                    id="store-phone"
                    placeholder="+1 (555) 123-4567"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="store-currency" className="text-sm font-medium">
                    Currency
                  </label>
                  <Input
                    id="store-currency"
                    placeholder="USD"
                    defaultValue="USD"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <label htmlFor="store-address" className="text-sm font-medium">
                  Store Address
                </label>
                <Input
                  id="store-address"
                  placeholder="123 Component Street"
                  defaultValue="123 Component Street"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <Input placeholder="City" defaultValue="Electronics City" />
                  <Input placeholder="State" defaultValue="CA" />
                  <Input placeholder="Zip Code" defaultValue="90210" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure shipping options and rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Shipping settings will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and processors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Payment settings will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and system notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Notification settings will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

