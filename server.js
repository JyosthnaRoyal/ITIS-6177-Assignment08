const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { check, validationResult } = require("express-validator");
const { getConnection } = require("./helper");
const OPTIONS = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Swagger Express Excercise ",
            version: "1.0.0",
            description: "Express Swagger API",
            termsOfService: "http://example.com/terms/",
            contact: {
                name: "Jyosthna Gandhodi",
                url: "https://github.com/JyosthnaRoyal",
                email: "jgandhod@uncc.edu",
            },
        },

        servers: [{
            url: "http://localhost:3000/",
            description: "Documentation of Swagger Express API ",
        }, ],
    },
    apis: ["./*.js"],
};

const PORT = process.env.PORT || 3000;
const app = express();
const specs = swaggerJsDoc(OPTIONS);

app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - COMPANY_ID
 *         - COMPANY_NAME
 *         - COMPANY_CITY
 *       properties:
 *         COMPANY_ID:
 *           type: string
 *         COMPANY_NAME:
 *           type: string
 *         COMPANY_CITY:
 *           type: string
 *       example:
 *         COMPANY_ID: 21
 *         COMPANY_NAME: Accenture
 *         COMPANY_CITY: Bengaluru
 */
/**
 * @swagger
 * /company:
 *   post:
 *     summary: Registering a new company
 *     tags: [company]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  COMPANY_ID:
 *                    type: string
 *                    example: 21
 *                  COMPANY_NAME:
 *                    type: string
 *                    example: Accenture
 *                  COMPANY_CITY:
 *                    type: string
 *                    example: Bengaluru
 *     responses:
 *       200:
 *         description: registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description:  Failed in Registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Cannot  register
 */

app.post("/company", (req, res) => {
    let body = req.body;
    getConnection()
        .then((conn) => {
            conn
                .query("INSERT INTO COMPANY VALUES (?,?,?)", [
                    body.COMPANY_ID,
                    body.COMPANY_NAME,
                    body.COMPANY_CITY,
                ])
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});
/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Returns companies list
 *     tags: [company]
 *     responses:
 *       200:
 *         description: list of the companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/company'
 *       422:
 *         description: Failed in validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Cannot  get companies rows
 */
app.get("/companies", (req, res) => {
    getConnection()
        .then((conn) => {
            conn
                .query("SELECT * from company")
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

/**
 * @swagger
 * /company:
 *   put:
 *     summary: Updating a company city for a specified company_id
 *     tags: [company]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  COMPANY_ID:
 *                    type: string
 *                    example: 21
 *                  COMPANY_CITY:
 *                    type: string
 *                    example: Bengaluru_new
 *     responses:
 *       200:
 *         description: registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description:  Failed in Registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Cannot  register
 */

app.put("/company", (req, res) => {
    let body = req.body;
    getConnection()
        .then((conn) => {
            conn
                .query("UPDATE COMPANY SET COMPANY_CITY = ? WHERE COMPANY_ID = ?", [
                    body.COMPANY_CITY,
                    body.COMPANY_ID,
                ])
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

/**
 * @swagger
 * /company:
 *   patch:
 *     summary: Updating company name for a specified company city
 *     tags: [company]
 *     requestBody:
 *       content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  COMPANY_NAME:
 *                    type: string
 *                    example: Accenture_old
 *                  COMPANY_CITY:
 *                    type: string
 *                    example: Bengaluru
 *     responses:
 *       200:
 *         description: registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description:  Failed in Registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Cannot  register
 */

app.patch("/company", (req, res) => {
    let body = req.body;
    getConnection()
        .then((conn) => {
            conn
                .query("UPDATE COMPANY SET COMPANY_NAME = ? WHERE COMPANY_CITY = ?", [
                    body.COMPANY_NAME,
                    body.COMPANY_CITY,
                ])
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

/**
 * @swagger
 * /company/{id}:
 *   delete:
 *     summary: Deleteing a company with given id
 *     tags: [company]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 21
 *         required: true
 *         description: id  needs to be deleted
 *     responses:
 *       200:
 *         description: Deleted Succesfully .
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       422:
 *         description: Failed in Validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Cannot not delete a company
 */

app.delete("/company/:id", (req, res) => {
    let id = req.params.id;
    getConnection()
        .then((conn) => {
            conn
                .query("DELETE FROM COMPANY WHERE COMPANY_ID = ?", id)
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/customers", (req, res) => {
    getConnection()
        .then((conn) => {
            conn
                .query("SELECT * from customer")
                .then((rows) => {
                    conn.release();
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/company", (req, res) => {
    getConnection()
        .then((conn) => {
            conn
                .query("SELECT * from company")
                .then((rows) => {
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/daysorder", (req, res) => {
    getConnection()
        .then((conn) => {
            conn
                .query("SELECT * from daysorder")
                .then((rows) => {
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/despatch", (req, res) => {
    getConnection()
        .then((conn) => {
            conn
                .query("SELECT * from despatch")
                .then((rows) => {
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/foods", (req, res) => {
    getConnection()
        .then((conn) => {
            conn
                .query("SELECT * from foods")
                .then((rows) => {
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/customer/:id", (req, res) => {
    var id = req.params.id;
    getConnection()
        .then((conn) => {
            conn
                .query(`SELECT * from customer where CUST_CODE = ?`, id)
                .then((rows) => {
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get("/orders", (req, res) => {
    var amount = req.query.amount;
    getConnection()
        .then((conn) => {
            conn
                .query(`SELECT * from orders where ORD_AMOUNT = ?`, amount)
                .then((rows) => {
                    console.log(rows);
                    res.json(rows);
                })
                .catch((err) => {
                    console.log(err);
                    conn.end();
                });
        })
        .catch((err) => {
            console.log(err);
        });
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));