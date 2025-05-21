-- Create orders table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NULL, -- Make user_id optional
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL,
  payment_id TEXT,
  payment_details JSONB,
  customer_email TEXT, -- Add customer email for guest orders
  customer_name TEXT, -- Add customer name for guest orders
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Set up Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Only admins can update orders" ON orders;

-- Create updated policies for orders
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    OR user_id IS NULL -- Allow viewing anonymous orders
  );

-- Allow inserting orders without authentication
CREATE POLICY "Anyone can insert orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

-- Allow updating orders without authentication (for webhooks)
CREATE POLICY "Anyone can update orders" 
  ON orders FOR UPDATE 
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
