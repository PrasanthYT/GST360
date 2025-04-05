"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export function ProductFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select defaultValue="all">
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="office-supplies">Office Supplies</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="stationery">Stationery</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Select defaultValue="all">
            <SelectTrigger id="brand">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="samsung">Samsung</SelectItem>
              <SelectItem value="hp">HP</SelectItem>
              <SelectItem value="dell">Dell</SelectItem>
              <SelectItem value="logitech">Logitech</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Select defaultValue="all">
            <SelectTrigger id="supplier">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              <SelectItem value="tech-distributors">Tech Distributors</SelectItem>
              <SelectItem value="office-world">Office World</SelectItem>
              <SelectItem value="global-supplies">Global Supplies</SelectItem>
              <SelectItem value="premium-furniture">Premium Furniture</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Price Range</Label>
          <div className="pt-4 px-2">
            <Slider defaultValue={[0, 50000]} min={0} max={100000} step={1000} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <Input type="number" placeholder="Min" className="w-[45%]" />
            <span className="text-muted-foreground">to</span>
            <Input type="number" placeholder="Max" className="w-[45%]" />
          </div>
        </div>

        <div>
          <Label>Stock Status</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Switch id="in-stock" />
              <Label htmlFor="in-stock" className="text-sm">
                In Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="low-stock" />
              <Label htmlFor="low-stock" className="text-sm">
                Low Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="out-of-stock" />
              <Label htmlFor="out-of-stock" className="text-sm">
                Out of Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="discontinued" />
              <Label htmlFor="discontinued" className="text-sm">
                Discontinued
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>GST Rate</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Switch id="gst-0" />
              <Label htmlFor="gst-0" className="text-sm">
                0%
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="gst-5" />
              <Label htmlFor="gst-5" className="text-sm">
                5%
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="gst-12" />
              <Label htmlFor="gst-12" className="text-sm">
                12%
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="gst-18" />
              <Label htmlFor="gst-18" className="text-sm">
                18%
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="gst-28" />
              <Label htmlFor="gst-28" className="text-sm">
                28%
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <Switch id="gst-included" defaultChecked />
          <Label htmlFor="gst-included">GST Included in Price</Label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Reset Filters</Button>
          <Button>Apply Filters</Button>
        </div>
      </div>
    </div>
  )
}

