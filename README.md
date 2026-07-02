# Unnaidee

เว็บไซต์รวมลิงก์ affiliate สินค้า Shopee สไตล์ Linktree พร้อมระบบหลังบ้าน (Admin) สำหรับจัดการสินค้า หมวดหมู่ และดูสถิติการคลิก/เข้าชม

- หน้าลูกค้า: `/`
- หน้า Admin (ต้อง login): `/admin`

---

## 1. สร้างโปรเจกต์ Supabase (ฟรี)

1. ไปที่ https://supabase.com สร้างบัญชี แล้วกด **New project**
2. ตั้งชื่อโปรเจกต์ (เช่น `unnaidee`) และตั้งรหัสผ่านฐานข้อมูล เก็บไว้ให้ดี
3. รอสักครู่จนโปรเจกต์สร้างเสร็จ
4. ไปที่เมนู **SQL Editor** (แถบซ้าย) → กด **New query**
5. เปิดไฟล์ `supabase/schema.sql` ในโปรเจกต์นี้ คัดลอกทั้งหมด วางในช่อง SQL Editor แล้วกด **Run**
   - จะได้ตาราง `categories`, `products`, `clicks`, `page_views` พร้อม RLS policy และหมวดหมู่ตัวอย่าง 4 หมวด

## 2. สร้างบัญชี Admin (ตัวคุณเอง)

1. ไปที่เมนู **Authentication → Users** → กด **Add user**
2. ใส่อีเมลและรหัสผ่านที่จะใช้ login เข้าหน้า `/admin` (เลือก "Auto Confirm User" ด้วย เพื่อไม่ต้องยืนยันอีเมล)
3. เก็บอีเมล/รหัสผ่านนี้ไว้ใช้ login

> ระบบตั้งไว้ว่า **ใครก็ตามที่ login สำเร็จ (authenticated) จะแก้ไขข้อมูลได้ทั้งหมด** เพราะฉะนั้นสร้างบัญชีเดียวไว้ใช้เองพอ อย่าแชร์รหัสผ่าน

## 3. เอาค่า API มาใส่ในโปรเจกต์

1. ไปที่ **Project Settings → API**
2. คัดลอกค่า **Project URL** และ **anon public key**
3. คัดลอกไฟล์ `.env.local.example` เป็น `.env.local` แล้วใส่ค่า:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. รันบนเครื่องตัวเอง (ทดสอบก่อน deploy)

```bash
npm install
npm run dev
```

เปิด http://localhost:3000 ดูหน้าลูกค้า และ http://localhost:3000/admin ดูหน้า admin (ต้อง login ด้วยบัญชีที่สร้างในข้อ 2)

## 5. อัปโหลดขึ้น GitHub

```bash
git init
git add .
git commit -m "init unnaidee"
git branch -M main
git remote add origin https://github.com/<username>/unnaidee.git
git push -u origin main
```

## 6. Deploy ฟรีด้วย Vercel

1. ไปที่ https://vercel.com สมัคร/login ด้วยบัญชี GitHub
2. กด **Add New Project** → เลือก repo `unnaidee` ที่เพิ่ง push ขึ้นไป
3. ในหน้า **Environment Variables** ใส่ค่าเดียวกับใน `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. กด **Deploy** รอสักครู่ก็จะได้ URL ใช้งานจริง (ต่อโดเมนของตัวเองทีหลังได้ฟรีเช่นกัน)

หลังจากนี้ทุกครั้งที่ `git push` ขึ้น GitHub เว็บจะ deploy เวอร์ชันใหม่ให้อัตโนมัติ

---

## โครงสร้างที่ควรรู้

- `app/page.js` — หน้าลูกค้า (public)
- `app/admin/login/page.js` — หน้า login
- `app/admin/(protected)/` — หน้า admin ทั้งหมด (แดชบอร์ด, สินค้า, หมวดหมู่) ถูกป้องกันด้วย `middleware.js`
- `app/api/click/route.js` — log การคลิกสินค้าแล้ว redirect ไป Shopee
- `app/api/pageview/route.js` — log การเข้าชมหน้าเว็บ
- `lib/actions/` — server actions สำหรับเพิ่ม/แก้/ลบสินค้าและหมวดหมู่
- `supabase/schema.sql` — โครงสร้างฐานข้อมูลทั้งหมด

## เกี่ยวกับราคา/ส่วนลด

ราคาและส่วนลดในระบบนี้ **ไม่ได้ sync กับ Shopee อัตโนมัติ** (Shopee ไม่เปิด API ราคาให้ affiliate รายบุคคลใช้ฟรี) ต้องเข้าไปอัปเดตเองที่หน้า **Admin → สินค้า → แก้ไข** เวลาราคาหรือโปรโมชั่นเปลี่ยน
