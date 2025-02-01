const fs = require("fs");
const path = require("path");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const featureDirs = fs.readdirSync(__dirname).filter((dir) =>
    fs.statSync(path.join(__dirname, dir)).isDirectory()
);

// ✅ Define paths
const rootSwaggerFile = path.join(__dirname, "swagger.json");

// ✅ Remove old Swagger files (only on `npm run start`)
console.log("🚀 Cleaning up old Swagger files...");
featureDirs.forEach((feature) => {
    const featureSwaggerFile = path.join(__dirname, feature, `${feature}.swagger.json`);
    if (fs.existsSync(featureSwaggerFile)) {
        fs.unlinkSync(featureSwaggerFile);
        console.log(`🗑 Deleted: ${featureSwaggerFile}`);
    }
});

if (fs.existsSync(rootSwaggerFile)) {
    fs.unlinkSync(rootSwaggerFile);
    console.log(`🗑 Deleted: ${rootSwaggerFile}`);
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Chatbox API",
            version: "1.0.0",
            description: "API documentation for Chatbox backend",
            contact: {
                name: "Tareq Ghassan",
                email: "tareq.abusaleh47@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Local development server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                ServerConnection: {
                    type: "object",
                    properties: {
                        appKey: { type: "string", description: "Unique application key" },
                        appSecret: { type: "string", description: "Secret key for authentication" },
                    },
                    required: ["appKey", "appSecret",],
                },
                Configuration: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Configuration name" },
                        code: { type: "string", description: "Configuration code" },
                    },
                    required: ["name", "code",],
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Unique user ID" },
                        name: { type: "string", description: "Full name of the user" },
                        email: { type: "string", format: "email", description: "Email address of the user" },
                        phoneNumber: {
                            type: "object",
                            properties: {
                                code: { type: "string", description: "Country code" },
                                number: { type: "string", description: "Phone number" },
                            },
                        },
                        password: { type: "string", format: "password", description: "Hashed password of the user" },
                        salt: { type: "string", format: "password", description: "Salt used for password hashing" },
                        profileImage: { type: "string", description: "URL to the user's profile image" },
                    },
                    required: ["id", "name", "email", "phoneNumber"],
                },
            },
        },
    },
    apis: ["./**/router/*.js"],
};

// ✅ Generate Swagger JSON for Each Feature
let combinedSwaggerSpec = swaggerJsdoc({ ...options, apis: [] });

featureDirs.forEach((feature) => {
    const routerPath = path.join(__dirname, feature, "router");
    if (!fs.existsSync(routerPath)) return;

    const featureSwaggerSpec = swaggerJsdoc({
        ...options,
        apis: [`./${feature}/router/*.js`]
    });

    const featureSwaggerFilePath = path.join(__dirname, feature, `${feature}.swagger.json`);

    // ✅ Save feature Swagger JSON (Only if not already existing)
    if (!fs.existsSync(featureSwaggerFilePath)) {
        fs.writeFileSync(featureSwaggerFilePath, JSON.stringify(featureSwaggerSpec, null, 2));
        console.log(`📁 Swagger JSON for ${feature} created at: ${featureSwaggerFilePath}`);
    }

    // ✅ Merge into combined Swagger
    combinedSwaggerSpec.paths = { ...combinedSwaggerSpec.paths, ...featureSwaggerSpec.paths };

    if (featureSwaggerSpec.components) {
        combinedSwaggerSpec.components.schemas = {
            ...combinedSwaggerSpec.components.schemas,
            ...featureSwaggerSpec.components.schemas,
        };
    }
});

// ✅ Save Combined Swagger JSON
if (!fs.existsSync(rootSwaggerFile)) {
    fs.writeFileSync(rootSwaggerFile, JSON.stringify(combinedSwaggerSpec, null, 2));
    console.log(`📁 Combined Swagger JSON saved at: ${rootSwaggerFile}`);
}

// ✅ Setup Swagger UI in Express
const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(combinedSwaggerSpec));
    console.log(`✅ Swagger UI available at: http://localhost:${process.env.PORT}/api-docs`);

    app.get("/:feature/swagger.json", (req, res) => {
        const featureFilePath = path.join(__dirname, req.params.feature, `${req.params.feature}.swagger.json`);
        if (fs.existsSync(featureFilePath)) {
            res.sendFile(featureFilePath);
        } else {
            res.status(404).json({ error: "Swagger file not found for this feature." });
        }
    });

    app.get("/swagger.json", (req, res) => {
        res.sendFile(rootSwaggerFile);
    });
};

module.exports = setupSwagger;