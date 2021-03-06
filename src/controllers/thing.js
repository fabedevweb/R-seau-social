var db = require("../../config/db.config");
//Package fs pour supprimer un fichier image en local
const fs = require("fs");

exports.createThing = (req, res, next) => {
  const file = req.file;
  const userId = req.body.userId;
  const pseudo = req.body.pseudo;
  const comment = req.body.comment;
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  const sql = `INSERT post SET userId ='${userId}', pseudo ="${pseudo}",comment ="${comment}", imageUrl ='${imageUrl}'`;
  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  } else {
    db.query(sql, (err) => {
      if (err) {
        throw err;
      }
      return res.send({ message: "File is successfully.", file });
    });
  }
};
exports.createReply = (req, res, next) => {
  const userId = req.body.userId;
  const comment = req.body.comment;
  const pseudo = req.body.pseudo;
  const idPost = req.body.idPost;

  const sql = `INSERT reply SET userId ='${userId}',comment ="${comment}",pseudo ="${pseudo}", idPost ='${idPost}'`;
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    return res.send({ message: "Reply is successfully" });
  });
};
//Utilisé sur la route Reply
exports.getReply = (req, res, next) => {
  const idPost = req.params.id;
  db.query(`SELECT * FROM reply WHERE idPost=${idPost}`, function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
};

exports.deleteReply = (req, res, next) => {
  var sql = "DELETE FROM `reply` WHERE `id`=?";
  db.query(sql, [req.params.id], function(error, results, fields) {
    if (error) throw error;
    return res.send({ message: "Le fichier a été supprimé" });
  });
};
exports.getAllThing = (req, res, next) => {
  db.query("SELECT * FROM post ORDER BY createdPostAt DESC", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
};
//Utilisé sur la route UpdatePost
exports.getOneThing = (req, res, next) => {
  db.query(
    `SELECT * FROM post WHERE id=${req.params.id} OR userId=${req.params.id}`,
    req.params.id,
    function(error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
};
exports.updateThing = (req, res, next) => {
  const comment = req.body.comment;
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  var sql = `UPDATE post SET comment ='${comment}', imageUrl ='${imageUrl}' WHERE id = ${req.params.id}`;
  db.query(sql, function(error, results, fields) {
    if (error) throw error;
    return res.send({ message: "Le fichier a été modifié" });
  });
};
exports.deleteThing = (req, res, next) => {
  var sql = "DELETE FROM `post` WHERE `id`=?";
  db.query(sql, [req.params.id], function(error, results, fields) {
    if (error) throw error;
    return res.send({ message: "Le fichier a été supprimé" });
  });
};
