import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import argparse

# Sembunyikan pesan log TensorFlow yang tidak penting
#os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ==============================================================================
# 1. PENGATURAN HYPERPARAMETER (Parameter Eksternal)
# ==============================================================================
parser = argparse.ArgumentParser()
parser.add_argument('--epochs', type=int, default=20, help='Jumlah perulangan belajar')
parser.add_argument('--batch_size', type=int, default=32, help='Jumlah gambar per batch')
parser.add_argument('--learning_rate', type=float, default=0.0001, help='Langkah belajar AI')
args = parser.parse_args()

# Pastikan alamat folder dataset ini benar sesuai komputermu
DATA_DIR = r"D:\Landslide_disaster_classification\dataset"

IMG_WIDTH, IMG_HEIGHT = 224, 224 # Ukuran standar gambar untuk VGG16
BATCH_SIZE = args.batch_size
EPOCHS = args.epochs
LEARNING_RATE = args.learning_rate

print("=== MEMULAI PROSES TRAINING AI (VGG16) ===")
print(f"[INFO] Setelan aktif: Epochs={EPOCHS}, Batch={BATCH_SIZE}, LR={LEARNING_RATE}")

# ==============================================================================
# 2. PENYIAPAN DATASET & DATA AUGMENTASI 
# ==============================================================================
print("[INFO] Menyiapkan dan Membagi Dataset...")

# Perlu diingat: VGG16 menggunakan preprocess input khusus (berbeda dengan MobileNet)
# Tapi untuk tahap dasar dan agar seimbang komparasinya, kita tetap pakai rescale 1./255
datagen = ImageDataGenerator(
    rescale=1./255,           
    rotation_range=20,        
    width_shift_range=0.2,    
    height_shift_range=0.2,   
    zoom_range=0.2,           
    horizontal_flip=True,     
    validation_split=0.2      
)

train_generator = datagen.flow_from_directory(
    DATA_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

val_generator = datagen.flow_from_directory(
    DATA_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# ==============================================================================
# 3. MEMBANGUN ARSITEKTUR VGG16
# ==============================================================================
print("\n[INFO] Membangun Arsitektur VGG16...")

# Memanggil model dasar VGG16 (Transfer Learning)
base_model = VGG16(
    weights='imagenet', 
    include_top=False,  # Buang lapisan klasifikasi asli
    input_shape=(IMG_WIDTH, IMG_HEIGHT, 3)
)

# Kunci ilmu dasar VGG16
base_model.trainable = False

# Membangun lapisan baru (Classifier) di atas VGG16
# Catatan: VGG16 biasanya menggunakan Flatten(), bukan GlobalAveragePooling2D
model = Sequential([
    base_model,
    Flatten(),                     # Meratakan fitur matriks menjadi 1 dimensi
    Dense(256, activation='relu'), # VGG16 biasanya butuh neuron lebih banyak (256)
    Dropout(0.5),                  # Mencegah overfitting
    Dense(5, activation='softmax') # LAPISAN OUTPUT: 5 Kelas Bencana
])

# Mengkompilasi model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# ==============================================================================
# 4. PROSES TRAINING
# ==============================================================================
print("\n[INFO] VGG16 Mulai Belajar (Proses Training)...")
# Menambahkan checkpoint agar otomatis menyimpan model terbaik
checkpoint_path = '../../saved_models/disaster_model_vgg16.h5'
os.makedirs(os.path.dirname(checkpoint_path), exist_ok=True)

cp_callback = tf.keras.callbacks.ModelCheckpoint(
    filepath=checkpoint_path, 
    monitor='val_accuracy', 
    save_best_only=True, # Hanya simpan saat akurasi meningkat
    verbose=1
)

history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[cp_callback] # Pasang fitur autosave
)

print(f"\n[SUKSES] 🎉 Training VGG16 selesai!")
print(f"[SUKSES] Otak VGG16 terbaik berhasil disimpan di: {checkpoint_path}")