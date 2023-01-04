import { nanoid } from "nanoid";

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomIp() {
  return (
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255)
  );
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}

const generatePayout = (facts, outcomes)=>{
  console.log({facts, outcomes})
  let sumBonus = 0;
  return `
  Drives Payout: ${formatter.format(facts.payoutSum)}
  Bonuses: 
  ${outcomes.map(bonus =>{
    const bon = bonus?.params?.bonus || 0;
    sumBonus += bon;
    return `
    * ${bonus.type} amount: ${formatter.format(bon)}`
  })}
  Total Payout: ${formatter.format(sumBonus+facts.payoutSum)}
  `
}
const columns =  [
  {
    name: "Driver Id",
    selector: (row) => row.driverId,
    width: "100px",
  },
  {
    name: "Timestamp",
    selector: (row) => row.timestamp,
    width: "200px",
  },
  {
    name: "Trip Id",
    selector: (row) => row.id,
    width: "150px",
  },
  {
    name: "Rating",
    selector: (row) => row.rating,
  },
  {
    name: "Trip Price",
    selector: (row) => row.price,
  },
  {
    name: "Coordinates",
    selector: (row) => row.coordinates,
    width: "180px",
  },
  {
    name: "IP",
    selector: (row) => row.ip,
    width: "150px",
  },
];
export default {
  name: "Car",
  attributes: [
    {
      name: "DrivesPerWeek",
      type: "number",
    },
    {
      name: "AverageRating",
      type: "number",
    },
    {
      name: "State",
      type: "string",
    },
    {
      name: "AccountAge",
      type: "number",
    },
  ],
  decisions: [
    {
      conditions: {
        all: [
          {
            fact: "DrivesPerWeek",
            operator: "greaterThanInclusive",
            value: 5,
          },
        ],
      },
      event: {
        type: "Weekly-Trip-Goal-Bonus",
        params: {
          bonus: 5,
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: "AverageRating",
            operator: "greaterThanInclusive",
            value: 3,
          },
          {
            fact: "AverageRating",
            operator: "notEqual",
            value: 5,
          },
        ],
      },
      event: {
        type: "Satisfying-Rating-Bonus",
        params: {
          bonus: 3,
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: "DrivesPerWeek",
            operator: "greaterThanInclusive",
            value: 5,
          },
          {
            fact: "AverageRating",
            operator: "greaterThanInclusive",
            value: 3,
          },
          {
            fact: "AccountAge",
            operator: "lessThan",
            value: 1,
          },
          {
            any: [
              {
                fact: "State",
                operator: "equal",
                value: "New York",
              },
              {
                fact: "State",
                operator: "equal",
                value: "New Jersey",
              },
            ],
          },
        ],
      },
      event: {
        type: "Weekly-Cash-Bonus",
        params: {
          bonus: 15
        },
      },
    },
    {
      conditions: {
        all: [
          {
            fact: "AverageRating",
            operator: "greaterThanInclusive",
            value: 4.5,
          },
        ],
      },
      event: {
        type: "High-Rating-Bonus",
        params: {
          bonus:10
        },
      },
    },
  ],
  table: [
    {
      metadata: "Driver Id: 1 Driver Since: 2016 Driver State: Arizona",
      columns,
      data: [
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
          ),
          id: nanoid(10),
          rating: "4.5",
          price: formatter.format(26.99),
          coordinates: "40.7128°, 74.0060°",
          ip: randomIp(),
          driverId: 1,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
          ),
          id: nanoid(10),
          rating: "3.2",
          price: formatter.format(7.67),
          coordinates: "40.9641°, 75.9680°",
          ip: randomIp(),
          driverId: 1,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
          ),
          id: nanoid(10),
          rating: "4.5",
          price: formatter.format(26.99),
          coordinates: "42.9562°, 74.2364°",
          ip: randomIp(),
          driverId: 1,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
          ),
          id: nanoid(10),
          rating: "5",
          price: formatter.format(19.99),
          coordinates: "43.8312°, 74.9451°",
          ip: randomIp(),
          driverId: 1,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 0, 1), new Date(2022, 6, 30))
          ),
          id: nanoid(10),
          rating: "4.9",
          price: formatter.format(18.0),
          coordinates: "43.9812°, 74.2151°",
          ip: randomIp(),
          driverId: 1,
        },
      ],
      generatePayout,
      generateFacts: (data) => {
        const ratings = data.map((d) => Number(d.rating));
        const prices = data.map((d) => Number(d.price.slice(1)));
        const avgRating =
          ratings.reduce((acc, c) => acc + c, 0) / ratings.length;
        const payoutSum = prices.reduce((partialSum, a) => partialSum + a, 0);

        return {
          DrivesPerWeek: data.length,
          AverageRating: avgRating,
          State: "Arizona",
          AccountAge: 7,
          payoutSum
        };
      },
    },
    {
      metadata: "Driver Id: 2 Driver Since: 2022 Driver State: New York",
      columns,
      data: [
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 6, 6), new Date(2022, 12, 30))
          ),
          id: nanoid(10),
          rating: "1.5",
          price: formatter.format(26.99),
          coordinates: "40.7128°, 74.0060°",
          ip: randomIp(),
          driverId: 2,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 6, 6), new Date(2022, 12, 30))
          ),
          id: nanoid(10),
          rating: "4.6",
          price: formatter.format(7.67),
          coordinates: "40.9641°, 75.9680°",
          ip: randomIp(),
          driverId: 2,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 6, 6), new Date(2022, 12, 30))
          ),
          id: nanoid(10),
          rating: "3.2",
          price: formatter.format(26.99),
          coordinates: "42.9562°, 74.2364°",
          ip: randomIp(),
          driverId: 2,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 6, 6), new Date(2022, 12, 30))
          ),
          id: nanoid(10),
          rating: "4.6",
          price: formatter.format(7.67),
          coordinates: "40.9641°, 75.9680°",
          ip: randomIp(),
          driverId: 2,
        },
        {
          timestamp: formatDate(
            randomDate(new Date(2022, 6, 6), new Date(2022, 12, 30))
          ),
          id: nanoid(10),
          rating: "5",
          price: formatter.format(26.99),
          coordinates: "42.9562°, 74.2364°",
          ip: randomIp(),
          driverId: 2,
        },
      ],
      generatePayout,
      generateFacts: (data) => {
        const ratings = data.map((d) => Number(d.rating));
        const prices = data.map((d) => Number(d.price.slice(1)));
        const avgRating =
          ratings.reduce((acc, c) => acc + c, 0) / ratings.length;
        const payoutSum = prices.reduce((partialSum, a) => partialSum + a, 0);

        return {
          DrivesPerWeek: data.length,
          AverageRating: avgRating,
          State: "New York",
          AccountAge: 0,
          payoutSum
        };
      },
    },
  ],
};
