-- Insert sample glossary terms
insert into public.glossary (term, definition, category) values
  ('Diabetes', 'Penyakit kronis yang terjadi ketika tubuh tidak dapat memproduksi atau menggunakan insulin dengan baik, menyebabkan kadar gula darah tinggi.', 'Umum'),
  ('Insulin', 'Hormon yang diproduksi pankreas untuk membantu glukosa masuk ke sel-sel tubuh sebagai sumber energi.', 'Umum'),
  ('Glukosa', 'Gula sederhana yang merupakan sumber energi utama bagi sel-sel tubuh.', 'Umum'),
  ('HbA1c', 'Tes darah yang mengukur rata-rata kadar gula darah selama 2-3 bulan terakhir.', 'Medis'),
  ('Hipoglikemia', 'Kondisi ketika kadar gula darah terlalu rendah (biasanya di bawah 70 mg/dL).', 'Medis'),
  ('Hiperglikemia', 'Kondisi ketika kadar gula darah terlalu tinggi.', 'Medis'),
  ('BMI', 'Body Mass Index - indeks yang menghitung berat badan ideal berdasarkan tinggi dan berat badan.', 'Kesehatan'),
  ('Karbohidrat', 'Nutrisi yang menjadi sumber energi utama dan mempengaruhi kadar gula darah.', 'Nutrisi'),
  ('Glikemik Index', 'Ukuran seberapa cepat makanan meningkatkan kadar gula darah.', 'Nutrisi'),
  ('Prediabetes', 'Kondisi ketika kadar gula darah lebih tinggi dari normal tetapi belum cukup tinggi untuk didiagnosis sebagai diabetes.', 'Umum')
on conflict (term) do nothing;

-- Insert sample learning modules
insert into public.learning_modules (title, description, learning_objectives, estimated_duration_minutes, module_order, is_published) values
  (
    'Apa itu Diabetes?',
    'Pelajari dasar-dasar diabetes, jenis-jenisnya, dan bagaimana diabetes mempengaruhi tubuh.',
    ARRAY['Memahami definisi diabetes', 'Mengenal jenis-jenis diabetes', 'Memahami penyebab diabetes', 'Mengetahui gejala diabetes'],
    15,
    1,
    true
  ),
  (
    'Pencegahan Diabetes',
    'Pelajari cara mencegah diabetes melalui gaya hidup sehat dan pola makan yang baik.',
    ARRAY['Memahami faktor risiko diabetes', 'Mengenal pola makan sehat', 'Memahami pentingnya olahraga', 'Mengelola stres'],
    20,
    2,
    true
  ),
  (
    'Nutrisi untuk Diabetes',
    'Pelajari tentang makanan yang baik dan harus dihindari untuk penderita diabetes.',
    ARRAY['Memahami karbohidrat dan gula', 'Mengenal indeks glikemik', 'Merencanakan menu sehat', 'Membaca label nutrisi'],
    25,
    3,
    true
  ),
  (
    'Aktivitas Fisik & Diabetes',
    'Pelajari jenis olahraga yang aman dan bermanfaat untuk pencegahan dan pengelolaan diabetes.',
    ARRAY['Memahami manfaat olahraga', 'Mengenal jenis olahraga yang tepat', 'Membuat rutinitas olahraga', 'Keamanan saat berolahraga'],
    15,
    4,
    true
  )
on conflict do nothing;
