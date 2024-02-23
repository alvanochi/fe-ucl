export function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, index) => currentYear - index);

  return years.map(year => ({
    label: year.toString(),
    value: year.toString()
  }));
}

export function getMonthOptions() {
  const months = [
    { label: 'Januari', value: 'Januari' },
    { label: 'Februari', value: 'Februari' },
    { label: 'Maret', value: 'Maret' },
    { label: 'April', value: 'April' },
    { label: 'Mei', value: 'Mei' },
    { label: 'Juni', value: 'Juni' },
    { label: 'Juli', value: 'Juli' },
    { label: 'Agustus', value: 'Agustus' },
    { label: 'September', value: 'September' },
    { label: 'Oktober', value: 'Oktober' },
    { label: 'November', value: 'November' },
    { label: 'Desember', value: 'Desember' }
  ];

  return months;
}
