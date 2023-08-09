import { array, number, object, string } from "zod";

export const allSchemaId = object({
  query: object({
    _id: string({
      required_error: "no data with that id",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const roleSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
  }),
});

export const userRoleSchema = object({
  body: object({
    userId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    roleId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const userPermitSchema = object({
  body: object({
    userId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    permitId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const rolePermitSchema = object({
  body: object({
    roleId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    permitId: string().regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const permitSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }),
  }),
});

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    stationId: string({
      required_error: "You need station's id",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),

    password: string({
      required_error: "Password is required",
    }).min(6, "Passwrod too short should be 6 characters minimum"),
    comparePassword: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }),
  }).refine((data) => data.password === data.comparePassword, {
    message: "Password do not match",
    path: ["Password Confirmation"],
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(4, "password is too short"),
  }),
});

// export const stationDetailSchema = object({
//   body: object({
//     name: string({
//       required_error: "name is required",
//     }),
//     location: string({
//       required_error: "location is required",
//     }),
//     lienseNo: string({
//       required_error: "lienseNo is required",
//     }),
//   }),
// });

export const dailyReportSchema = object({
  body: object({
    stationId: string({
      required_error: "you need stationId",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
  }),
});

export const detailSaleSchema = object({
  query: object({
    depNo: string({
      required_error: "depNo is required",
      // required_error: "Not enough",
    }),
    nozzleNo: string({
      required_error: "nozzleNo is required",
      // required_error: "Not enough",
    }),
  }),
  body: object({
    vehicleType: string({
      required_error: "you need vehicleType",
      // required_error: "Not enough",
    }),
    nozzleNo: string({
      required_error: "nozzleNo is required",
      // required_error: "Not enough",
    }),
    fuelType: string({
      required_error: "fuelType is required",
      // required_error: "Not enough",
    }),
  }),
});

export const detailSaleUpdateSchema = object({
  query: object({
    stationDetailId: string({
      required_error: " Not enough",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),
    vocono: string({
      required_error: " Not enough",
    }),
  }),
  body: object({
    vehicleType: string({
      required_error: "Not enough",
    }),
  }),
});

export const detailSaleErrorUpdateSchema = object({
  query: object({
    vocono: string({
      required_error: " Not enough",
    }),
  }),
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export const fuelInSchema = object({
  body: object({
    // stationId: string({
    //   required_error: "you need stationId",
    // }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),

    driver: string({
      required_error: "you need add driver",
    }),

    bowser: string({
      required_error: "you need add driver",
    }),

    tankNo: string({
      required_error: "you need add driver",
    }),

    fuel_type: string({
      required_error: "you need add driver",
    }),

    recive_balance: string({
      required_error: "you need add driver",
    }),
  }),
});

export const fuelBalanceSchema = object({
  body: object({
    stationId: string({
      required_error: "no data with that id",
    }).regex(/^[0-9a-fA-F]{24}$/, "invlid id"),

    fuelType: string({
      required_error: "you need add fuel_type",
    }),

    capacity: string({
      required_error: "you need add capacity",
    }),

    opening: string({
      required_error: "you need add opening",
    }),

    tankNo: string({
      required_error: "you need add tankNo",
    }),

    // nozzles: array(
    //   string({
    //     required_error: "you need add nozzles",
    //   })
    // ),
  }),
});
