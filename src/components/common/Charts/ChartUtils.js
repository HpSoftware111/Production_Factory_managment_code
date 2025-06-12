export const generateLineBarChartData = (
  {
    actualStartDate = new Date(2023, 0, 1),    // Default Jan 1, 2023
    actualEndDate = new Date(2023, 4, 15),     // Default May 15, 2023
    forecastStartDate = new Date(2023, 0, 1), // Default May 16, 2023
    forecastEndDate = new Date(2023, 4, 15),   // Default June 30, 2023
    config = {}
  } = {}) => {
  const data = [];
  let currentDate = new Date(actualStartDate);
  const finalEndDate = forecastEndDate || actualEndDate;

  let baseCurrentValue = 2500;
  let baseForecastValue = 3000;

  while (currentDate <= finalEndDate) {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const isWithinActualRange = currentDate >= actualStartDate && currentDate <= actualEndDate;
    const isWithinForecastRange = forecastEndDate && currentDate >= forecastStartDate && currentDate <= forecastEndDate;

    data.push({
      day,
      month,
      year,
      currentValue: isWithinActualRange ? baseCurrentValue : null,
      forecastValue: isWithinForecastRange ? baseForecastValue : null
    });

    baseCurrentValue += 50;
    baseForecastValue += 50;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    unitMeasure: 'USD',
    data
  };
}


export const generateMultiBarChartData = (units = "%", ...barConfigs) => {
  const globalStartDate = new Date(Math.min(...barConfigs.map(config => config.startDate)));
  const globalEndDate = new Date(Math.max(...barConfigs.map(config => config.endDate)));

  const data = [];
  let currentDate = new Date(globalStartDate);

  const barData = barConfigs.map(config => ({
    ...config,
    min: config.min ?? 0,
    max: config.max ?? 100,
    baseValue: Math.floor(Math.random() * (config.max - config.min) + config.min),
    // Increase the range of daily increment
    dailyIncrement: () => {
      // Generate a random increment between -5 and 5
      const increment = (Math.random() * 10) - 5;
      // Add a trend component
      const trend = Math.sin((Math.random() - 0.5) * Math.PI);
      return increment + trend;
    }
  }));

  while (currentDate <= globalEndDate) {
    const dayData = {
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    };

    barData.forEach(bar => {
      const isWithinRange =
        currentDate >= bar.startDate &&
        currentDate <= bar.endDate;

      if (isWithinRange) {
        // Use the function to get a new increment each day
        const increment = bar.dailyIncrement();
        let newValue = bar.baseValue + increment;

        // Add some occasional larger jumps
        if (Math.random() < 0.1) { // 10% chance of a larger change
          newValue += (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 10 + 5);
        }

        // Ensure value stays within min/max bounds
        newValue = Math.max(bar.min, Math.min(bar.max, newValue));

        dayData[bar.label] = Math.round(newValue);
        bar.baseValue = newValue;
      } else {
        dayData[bar.label] = null;
      }
    });

    data.push(dayData);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    unitMeasure: units,
    data: data
  };
}