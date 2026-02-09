import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Yazılım Mühendisi",
          "Freelancer",
          "Geliştirici",
          "Açık Kaynak Gönüllüsü",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;