import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addOrder, generateOrderId } from "@/store/orderStore";
import {
  PRODUCTS,
  STATUSES,
  CREATED_BY_OPTIONS,
  Product,
  OrderStatus,
  CreatedBy,
} from "@/types/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FormErrors {
  [key: string]: string;
}

export default function CreateOrder() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    product: "" as Product | "",
    quantity: 1,
    unitPrice: 0,
    status: "Pending" as OrderStatus,
    createdBy: "" as CreatedBy | "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const totalAmount = form.quantity * form.unitPrice;

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleProductChange = (val: string) => {
    const found = PRODUCTS.find((p) => p.label === val);
    setForm((prev) => ({
      ...prev,
      product: val as Product,
      unitPrice: found?.price ?? 0,
    }));
    if (errors.product) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.product;
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    const required: (keyof typeof form)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
      "product",
      "createdBy",
    ];
    required.forEach((f) => {
      if (!form[f]) errs[f] = "Please fill the field";
    });
    if (form.quantity < 1) errs.quantity = "Quantity cannot be less than 1";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addOrder({
      id: generateOrderId(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      product: form.product as Product,
      quantity: form.quantity,
      unitPrice: form.unitPrice,
      totalAmount,
      status: form.status,
      createdBy: form.createdBy as CreatedBy,
      createdAt: new Date().toISOString(),
    });

    toast.success("Order created successfully!");
    navigate("/orders");
  };

  const fieldClass = (field: string) =>
    errors[field] ? "border-destructive" : "";

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create Order</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the customer and order details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <div className="bg-card rounded-lg border card-shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ["firstName", "First Name"],
              ["lastName", "Last Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["address", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal Code"],
              ["country", "Country"],
            ] as const).map(([key, label]) => (
              <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                <Label htmlFor={key}>{label} *</Label>
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`mt-1 ${fieldClass(key)}`}
                  placeholder={label}
                />
                {errors[key] && (
                  <p className="text-xs text-destructive mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-card rounded-lg border card-shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Order Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product */}
            <div>
              <Label>Product *</Label>
              <Select value={form.product} onValueChange={handleProductChange}>
                <SelectTrigger className={`mt-1 ${fieldClass("product")}`}>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.label} value={p.label}>
                      {p.label} — ${p.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product && (
                <p className="text-xs text-destructive mt-1">{errors.product}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) =>
                  handleChange("quantity", parseInt(e.target.value) || 0)
                }
                className={`mt-1 ${fieldClass("quantity")}`}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Unit Price (read-only) */}
            <div>
              <Label>Unit Price</Label>
              <Input
                value={`$${form.unitPrice.toFixed(2)}`}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>

            {/* Total Amount */}
            <div>
              <Label>Total Amount</Label>
              <Input
                value={`$${totalAmount.toFixed(2)}`}
                readOnly
                className="mt-1 bg-muted font-bold"
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status *</Label>
              <Select
                value={form.status}
                onValueChange={(v) => handleChange("status", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Created By */}
            <div>
              <Label>Created By *</Label>
              <Select
                value={form.createdBy}
                onValueChange={(v) => handleChange("createdBy", v)}
              >
                <SelectTrigger className={`mt-1 ${fieldClass("createdBy")}`}>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {CREATED_BY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.createdBy && (
                <p className="text-xs text-destructive mt-1">{errors.createdBy}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit">Create Order</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/orders")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
