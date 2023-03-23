router.post("/register", (req, res) => {
  let newUser = new User({
    name: req.body.name,
    password: req.body.password,
    avatar: req.body.avatar,
  });
  newUser
    .save()
    .then((result) => {
      res.redirect("login");
    })
    .catch((error) => {
      console.error("Error registrando usuario" + error);
    });
});

router.post("/login", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  user
    .find()
    .then((users) => {
      let existUser = users.filter(
        (user) => user.name == name && user.password == password
      );
      if (existUser.length > 0) {
        req.session.user = existUser[0].name;
        req.session.password = existUser[0].password;
      } else {
        console.error("Usuario o contraseña incorrectos" + error);
      }
    })
    .catch((error) => {
      console.error("Error iniciando sesion de usuario" + error);
    });
});