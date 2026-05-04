import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import api from '../../api/api';
import styles from './AddPetPage.module.css';

const FALLBACK_SPECIES = ['dog', 'cat', 'monkey', 'bird'];

const schema = yup.object({
  title: yup.string().required('Title is required'),
  name: yup.string().required('Name is required'),
  imgURL: yup.string().url('Invalid URL').required('Image URL is required'),
  species: yup.string().required('Species is required'),
  birthday: yup
    .string()
    .matches(/^\d{2}\.\d{2}\.\d{4}$/, 'Format: DD.MM.YYYY')
    .required('Birthday is required'),
  sex: yup.string().required('Sex is required'),
});

// Mini takvim yardımcıları
const MONTHS = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
];

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export default function AddPetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [speciesOpen, setSpeciesOpen] = useState(false);
  const [speciesList, setSpeciesList] = useState(FALLBACK_SPECIES);
  const [preview, setPreview] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Takvim state'i
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1); // 1-12

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const selectedSex     = watch('sex');
  const selectedSpecies = watch('species');
  const imgURL          = watch('imgURL');
  const birthday        = watch('birthday');

  // Tür listesini getir
  useEffect(() => {
    api.get('/notices/species')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) setSpeciesList(data);
      })
      .catch(() => {});
  }, []);

  // Dosya seçme
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // Takvim: gün seçimi
  const selectDay = (day) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(calMonth).padStart(2, '0');
    setValue('birthday', `${dd}.${mm}.${calYear}`, { shouldValidate: true });
    setCalendarOpen(false);
  };

  // Takvim: ay ve yıl değiştir
  const changeMonth = (dir) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setCalMonth(m);
    setCalYear(y);
  };

  const daysInMonth = getDaysInMonth(calMonth, calYear);

  // Form gönderimi – tarih formatını çevir
  const onSubmit = async (data) => {
    const parts = data.birthday.split('.');
    const formattedBirthday = `${parts[2]}-${parts[1]}-${parts[0]}`;

    const payload = { ...data, birthday: formattedBirthday };

    try {
      await api.post('/users/current/pets/add', payload);
      toast.success('Pet added! 🐾');
      navigate('/profile');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.imgPanel}>
        <img src="/dogwithglass.png" alt="Dog with glasses" className={styles.dogImg} />
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formBox}>
          <h1 className={styles.heading}>
            Add my pet <span className={styles.headingSub}>/ Personal details</span>
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Cinsiyet seçimi */}
            <div className={styles.sexRow}>
              <button type="button" className={`${styles.sexBtn} ${selectedSex === 'female' ? styles.sexBtnFemale : ''}`} onClick={() => setValue('sex', 'female', { shouldValidate: true })} title="Female">
                <img src="/female.svg" alt="Female" className={styles.sexIcon} />
              </button>
              <button type="button" className={`${styles.sexBtn} ${selectedSex === 'male' ? styles.sexBtnMale : ''}`} onClick={() => setValue('sex', 'male', { shouldValidate: true })} title="Male">
                <img src="/male.svg" alt="Male" className={styles.sexIcon} />
              </button>
              <button type="button" className={`${styles.sexBtn} ${selectedSex === 'unknown' ? styles.sexBtnActive : ''}`} onClick={() => setValue('sex', 'unknown', { shouldValidate: true })} title="Unknown">
                <img src="/multiple.svg" alt="Unknown" className={styles.sexIcon} />
              </button>

              <div className={styles.photoCircle}>
                {preview ? (
                  <img src={preview} alt="preview" className={styles.photoPreview} />
                ) : imgURL ? (
                  <img src={imgURL} alt="preview" className={styles.photoPreview} />
                ) : (
                  <span className={styles.photoPlaceholder}>🐾</span>
                )}
              </div>
            </div>
            {errors.sex && <span className={styles.fieldError}>{errors.sex.message}</span>}

            {/* URL + Upload */}
            <div className={styles.urlRow}>
              <input {...register('imgURL')} className={`${styles.input} ${errors.imgURL ? styles.inputError : ''}`} placeholder="Enter URL" />
              <button type="button" className={styles.uploadBtn} onClick={triggerFileInput}>
                Upload photo
                <img src="/upload-cloud.svg" alt="" className={styles.uploadIcon} />
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
            </div>
            {errors.imgURL && <span className={styles.fieldError}>{errors.imgURL.message}</span>}

            <input {...register('title')} className={`${styles.input} ${errors.title ? styles.inputError : ''}`} placeholder="Title" />
            {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}

            <input {...register('name')} className={`${styles.input} ${errors.name ? styles.inputError : ''}`} placeholder="Pet's Name" />
            {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}

            {/* Tarih + Tür satırı */}
            <div className={styles.dateSpeciesRow}>
              <div className={styles.dateWrap}>
                <input
                  {...register('birthday')}
                  className={`${styles.input} ${errors.birthday ? styles.inputError : ''}`}
                  placeholder="00.00.0000"
                />
                <img
                  src="/calendar.svg"
                  alt="calendar"
                  className={styles.calendarIcon}
                  onClick={() => setCalendarOpen(!calendarOpen)}
                />

                {/* Mini takvim dropdown */}
                {calendarOpen && (
                  <div className={styles.calendarDropdown}>
                    <div className={styles.calendarHeader}>
                      <button type="button" onClick={() => changeMonth(-1)}>‹</button>
                      <span>{MONTHS[calMonth - 1]} / {calYear}</span>
                      <button type="button" onClick={() => changeMonth(1)}>›</button>
                    </div>
                    <div className={styles.calendarGrid}>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={styles.calendarDay}
                          onClick={() => selectDay(day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tür dropdown */}
              <div className={styles.speciesWrap}>
                <button type="button" className={`${styles.speciesBtn} ${errors.species ? styles.inputError : ''}`} onClick={() => setSpeciesOpen((o) => !o)}>
                  <span style={{ color: selectedSpecies ? '#333' : '#b0b0b0' }}>
                    {selectedSpecies || 'Type of pet'}
                  </span>
                  <img src="/chevron-down.svg" alt="" className={`${styles.chevron} ${speciesOpen ? styles.chevronOpen : ''}`} />
                </button>

                {speciesOpen && (
                  <ul className={styles.dropdown}>
                    {speciesList.map((s) => (
                      <li key={s} className={`${styles.dropdownItem} ${selectedSpecies === s ? styles.dropdownItemActive : ''}`} onClick={() => { setValue('species', s, { shouldValidate: true }); setSpeciesOpen(false); }}>
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {(errors.birthday || errors.species) && (
              <span className={styles.fieldError}>{errors.birthday?.message || errors.species?.message}</span>
            )}

            <div className={styles.btnRow}>
              <button type="button" className={styles.backBtn} onClick={() => navigate('/profile')}>Back</button>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}