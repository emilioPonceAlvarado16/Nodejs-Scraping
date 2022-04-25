const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const docx = require("docx");
// const express = require("@runkit/runkit/express-endpoint/1.0.0");
// const app = express(exports);

const { Document, Packer, Paragraph, TextRun } = docx;
app.get("/news", async (req, res) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("Hello World"),
              new TextRun({
                text: "Foo Bar",
                bold: true,
              }),

              new TextRun({
                text: "\tGithub is the best",
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const b64string = await Packer.toBase64String(doc);

  res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
  res.send(Buffer.from(b64string, "base64"));
});
// app.get("/", async (req, res) => {
//   const doc = new Document({
//     sections: [
//       {
//         properties: {},
//         children: [
//           new Paragraph({
//             children: [
//               new TextRun("Hello World"),
//               new TextRun({
//                 text: "Foo Bar",
//                 bold: true,
//               }),
//               new TextRun({
//                 text: "\tGithub is the best",
//                 bold: true,
//               }),
//             ],
//           }),
//         ],
//       },
//     ],
//   });

//   const b64string = await Packer.toBase64String(doc);

//   res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
//   res.send(Buffer.from(b64string, "base64"));
// });
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
