# 🚀 คู่มือการนำเกม Hanuman Dash 3D ขึ้น Cloudflare Pages + เปิดระบบคะแนนระดับโลก (Global Leaderboard)

เกม **Hanuman Dash 3D (วายุบุตรพญาพานร • Himavanta Speed Runner)** ได้รับการออกแบบให้รันบน **Cloudflare Pages** ได้อย่างสมบูรณ์แบบ 100% โดยมีจุดเด่นคือ:
- ✅ **ฟรี Unlimited Bandwidth**: คนเข้ามาเล่นโหลดไฟล์โมเดล 3D และเพลงประกอบกี่แสนคนก็ไม่เสียค่า Bandwidth
- ✅ **ระบบ Global Leaderboard**: ผ่าน Cloudflare Pages Functions (`/api/leaderboard`)
- ✅ **ระบบ Graceful Fallback**: หากยังไม่ได้ผูก Database หรือเล่นออฟไลน์ เกมจะสลับไปใช้ `localStorage` ในเครื่องทันที ไม่มีปัญหาเกมค้างหรือหน้าจอพังแน่นอน

---

## ขั้นตอนที่ 1: นำโปรเจกต์ขึ้น Cloudflare Pages (เลือกวิธีที่สะดวกที่สุด)

### วิธีที่ A: ผ่าน GitHub (แนะนำที่สุด - โค้ดอัปเดตอัตโนมัติทุกครั้งที่ Git Push)
1. โค้ดเกมนี้ได้ถูกเชื่อมต่อและ Push ขึ้น GitHub เรียบร้อยแล้วที่:  
   👉 **https://github.com/leedploy/hanuman-dash.git**
2. เข้าสู่แดชบอร์ด [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. ไปที่เมนูซ้ายมือ: **Workers & Pages** ➔ คลิกปุ่ม **Create** ➔ เลือกแท็บ **Pages**
4. คลิกปุ่ม **Connect to Git**
5. เลือก Repository: **`leedploy/hanuman-dash`**
6. ตั้งค่าการ Build (Build Configuration):
   - **Framework preset**: `None`
   - **Build command**: ปล่อยว่าง (ไม่ต้องใส่)
   - **Build output directory**: `/` (หรือเว้นว่าง / ใส่ `.`)
7. คลิก **Save and Deploy** ➔ รอประมาณ 30 วินาที จะได้โดเมนพร้อมเล่นทันที เช่น `https://hanuman-dash.pages.dev`!

---

### วิธีที่ B: สั่ง Deploy ผ่าน Wrangler CLI ทันที (พิมพ์คำสั่งเดียวเสร็จ)
เนื่องจากในเครื่องนี้ได้ทำการล็อกอิน Cloudflare Account (`zeedzardgirl@gmail.com`) ไว้แล้ว สามารถสั่ง deploy ขึ้น Cloudflare Pages ได้ทันทีผ่าน Terminal:

```bash
npx wrangler pages deploy ./ --project-name=hanuman-dash
```

---

## ขั้นตอนที่ 2: เปิดใช้งานฐานข้อมูล Global Leaderboard (Cloudflare KV)

เพื่อให้คะแนนของผู้เล่นทั่วโลกถูกบันทึกไว้ตลอดกาลบน Edge Cloud ให้สร้างและผูก **Cloudflare KV** (ฟรี 100,000 อ่าน/วัน, 1,000 เขียน/วัน):

### ขั้นตอนสร้างและผูก KV:
1. ในหน้า Cloudflare Dashboard ไปที่เมนู **Workers & Pages** ➔ **KV**
2. คลิกปุ่ม **Create namespace**
   - ตั้งชื่อ Namespace Name: `hanuman_leaderboard`
   - คลิก **Add**
3. กลับไปที่โปรเจกต์ Pages ของคุณ (คลิกชื่อโปรเจกต์ `hanuman-dash` ในเมนู Workers & Pages)
4. ไปที่แท็บ **Settings** ➔ เมนูด้านซ้ายเลือก **Functions**
5. เลื่อนลงมาที่หัวข้อ **KV namespace bindings** แล้วกด **Add binding**:
   - **Variable name**: พิมพ์คำว่า `LEADERBOARD_KV` *(ต้องเป็นตัวพิมพ์ใหญ่ตามนี้เป๊ะๆ)*
   - **KV namespace**: เลือก namespace `hanuman_leaderboard` ที่เราเพิ่งสร้าง
6. กด **Save**
7. สั่ง **Redeploy** โปรเจกต์อีกครั้งหนึ่ง:
   - ไปที่แท็บ **Deployments** ➔ กดปุ่ม `...` ท้ายรายการล่าสุด ➔ เลือก **Retry deployment**

---

🎉 **เรียบร้อย!** เมื่อผู้เล่นเข้ามาเล่นเกมและบันทึกคะแนน:
- ตารางคะแนน Leaderboard จะขึ้นสถานะ `🟢 GLOBAL ONLINE`
- ผู้เล่นทั่วโลกจะสามารถแข่งทำคะแนนและบันทึกสถิติ Top 10 ได้แบบเรียลไทม์ทันทีครับ!

---

## 💡 สรุปสถานะการทำงาน (Hybrid Mode)
- **เมื่อต่อ Cloudflare Pages + KV สำเร็จ**: ตารางคะแนนจะดึงสถิติจาก Cloudflare KV มาแสดง พร้อมปุ่มกดสลับดูสถิติในเครื่องตัวเองได้
- **เมื่อเปิดเล่นแบบ Local / Offline**: ระบบจะตรวจพบอัตโนมัติ และสลับไปเป็น `💾 LOCAL STORAGE` ให้ทันที ผู้เล่นยังคงเล่นเกมได้ลื่นไหล บันทึกคะแนนลงเครื่องได้ตามปกติ 100%
