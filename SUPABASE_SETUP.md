# Supabase Database Setup Guide

Since the Supabase MCP tools are not available, you'll need to manually set up the database schema through the Supabase dashboard. Follow these steps:

## Prerequisites

1. ✅ Supabase project created
2. ✅ Environment variables added to `src/.env.local`
3. ✅ Supabase client integrated in the application

## Step 1: Apply Base Migration (0001_init.sql)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `wnaxppdlvfcfeluxlvxn`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire content from `supabase/migrations/0001_init.sql`
6. Click **Run** to execute the migration

This will create:
- `profiles` table (linked to auth.users)
- `products` table with basic schema
- `orders` table for order management
- `order_items` table for order line items
- `cart_items` table for cart persistence
- Row Level Security (RLS) policies
- `product-images` storage bucket

## Step 2: Apply Products & Cart Migration (0002_products_cart_rpc.sql)

1. In the same SQL Editor, create another **New Query**
2. Copy and paste the entire content from `supabase/migrations/0002_products_cart_rpc.sql`
3. Click **Run** to execute the migration

This will:
- Update products table schema to match the app's Product model
- Add columns: brand, original_price, images, type, notes, is_new, is_best_seller, is_on_sale
- Create `cart_items_view` for the cart functionality
- Create RPC functions: `upsert_cart_item`, `remove_cart_item`, `set_cart_item_quantity`, `clear_cart`

## Step 3: Seed Products Data

After both migrations are applied successfully:

```bash
node scripts/setup-database-simple.cjs
```

This will populate the products table with data from `src/data/products.json`.

## Step 4: Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. Verify these tables exist:
   - ✅ profiles
   - ✅ products (should have sample data)
   - ✅ orders
   - ✅ order_items
   - ✅ cart_items

3. Go to **Storage** and verify:
   - ✅ `product-images` bucket exists and is public

## Step 5: Test the Application

1. Start the development server: `npm run dev`
2. Test user registration/login at `/auth/signup` and `/auth/login`
3. Test adding products to cart
4. Test checkout process
5. Test viewing order history at `/account`

## Troubleshooting

### If you get "table does not exist" errors:
- Make sure both migration files were executed successfully
- Check the **Logs** section in Supabase dashboard for any errors

### If authentication doesn't work:
- Verify that the `profiles` table exists
- Check that RLS policies are enabled
- Ensure environment variables are correct

### If cart operations fail:
- Verify that RPC functions were created successfully
- Check that `cart_items_view` exists
- Test the functions in SQL Editor:
  ```sql
  SELECT * FROM cart_items_view WHERE user_id = 'your-user-id';
  ```

## Next Steps

Once the database is set up:
- [ ] Generate TypeScript types: `npx supabase gen types typescript --project-id wnaxppdlvfcfeluxlvxn > src/types/supabase.ts`
- [ ] Upload product images to the `product-images` storage bucket
- [ ] Configure email templates for authentication
- [ ] Set up webhooks for order processing (optional)

## Migration Files Location

- Base schema: `supabase/migrations/0001_init.sql`
- Products & RPC: `supabase/migrations/0002_products_cart_rpc.sql`
- Profiles auto-create trigger: `supabase/migrations/0006_auth_user_profile_trigger.sql`
- Setup script: `scripts/setup-database-simple.cjs`

### Apply the auth.users profile trigger

Run the contents of `supabase/migrations/0006_auth_user_profile_trigger.sql` in the Supabase SQL Editor. This creates a `security definer` trigger that inserts a row into `public.profiles` whenever a new user is created. This prevents client-side inserts from violating RLS during signup.