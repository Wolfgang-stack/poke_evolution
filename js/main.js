//Example fetch using pokemonapi.co
document.querySelector("button").addEventListener("click", getFetch);

async function getFetch() {
  const poke2 = document.querySelector("#poke2").value;
  const url = "https://pokeapi.co/api/v2/pokemon/" + poke2.toLowerCase();
  let newDiv = document.createElement("div");
  newDiv.classList.add("container", "containerCard");
  document.querySelector("body").appendChild(newDiv);
  //original pokemon
  const res1 = await fetch(url);
  const pokemonObj = await res1.json();
  console.log(pokemonObj);
  //fetch the species data - this contains the evolution chain ID
  const res2 = await fetch(pokemonObj.species.url);
  const pokedex = await res2.json();
  console.log(pokedex);
  const theName = pokedex.name;

  //come back and insert dynamic html at end with gathered info***********
  let pokename = document.createElement("h4");
  pokename.innerText = `${theName.charAt(0).toUpperCase()+theName.slice(1)}'s chain looks like... `;
  pokename.classList.add("wideText");
  newDiv.append(pokename);
  const res3 = await fetch(pokedex.evolution_chain.url); //hi James :) (╯°□°)╯︵ ┻━┻
  const evolutionChain = await res3.json();
  let pokeImages = [];
  let names = [];
  if (evolutionChain.chain.evolves_to.length < 1) {
    pokename.innerText += ` ${evolutionChain.chain.species.name.charAt(0).toUpperCase()+evolutionChain.chain.species.name.slice(1)} and then nothing`;

    pokeImages.push(pokemonObj.sprites.front_default);
  } else {
    console.log(evolutionChain)
    names.push(evolutionChain.chain.species.name.charAt(0).toUpperCase()+evolutionChain.chain.species.name.slice(1));
    //pokeImages.push(pokemonObj.sprites.front_default);
    await multiplePokes(evolutionChain.chain.species.name, pokeImages)
    //*** IF THE POKEMON HAS AN EVOLUTION

    let divergence1 = [];

    for (const index of evolutionChain.chain.evolves_to) {
      //IF THERE IS MORE THAN ONE (SEE EEVEE) MULTIPLE FETCHS WILL BE CALLED
      divergence1.push(index.species.name.charAt(0).toUpperCase()+index.species.name.slice(1));
      console.log(evolutionChain);
      await multiplePokes(index.species.name, pokeImages); //*********
    }

    //FOR EACH EVOLUTION ANOTHER FETCH IS NECESSARY TO RETRIEVE THE IMAGE URL

    names.push(divergence1.join(" or "));

    //***IF THAT EVOLUTION HAS AN EVOLUTION */
    if (evolutionChain.chain.evolves_to[0].evolves_to.length > 0) {
      let divergence2 = [];
      for (const index of evolutionChain.chain.evolves_to[0].evolves_to) {
        //IF THERE IS MORE THAN ONE (SEE ODDISH) MULTIPLE FETCHS WILL BE CALLED
        divergence2.push(index.species.name.charAt(0).toUpperCase()+index.species.name.slice(1));
        await multiplePokes(index.species.name, pokeImages);
      }
      names.push(divergence2.join(" or "));
    }
  }


  for (const img of pokeImages) {
    let pokeImg = document.createElement("img");
    pokeImg.src = img;
    newDiv.appendChild(pokeImg);
  }
  pokename.innerText += names.join(" and then ") + ".";
  newDiv.style.border = "8px ridge rgb(39,147,142)"
  newDiv.style.borderRadius = "1%"
  newDiv.style.backgroundColor = "rgb(138,221,86)"
  console.log(pokeImages);
}

//WTF AM I DOING HERE********
async function multiplePokes(name, array) {
  let one = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  let two = await one.json();
  array.push(two.sprites.front_default); //push img url to pokeImages***
}
