//Example fetch using pokemonapi.co
document.querySelector("button").addEventListener("click", getFetch);

async function getFetch() {
  const poke2 = document.querySelector("#poke2").value;
  const url = "https://pokeapi.co/api/v2/pokemon/" + poke2;
  let newDiv = document.createElement("div");
  newDiv.classList.add("container", 'containerCard');
  document.querySelector("body").appendChild(newDiv);
  //original pokemon
  const res1 = await fetch(url);
  const pokemonObj = await res1.json();
  console.log(pokemonObj);
  //fetch the species data - this contains the evolution chain ID
  const res2 = await fetch(pokemonObj.species.url);
  const pokedex = await res2.json();

  const theName = pokedex.name;
  let pokename = document.createElement("h4");
  pokename.innerText = `${theName}'s chain looks like... `;
  pokename.classList.add('wideText')
  newDiv.append(pokename);
  const res3 = await fetch(pokedex.evolution_chain.url);
  const evolutionChain = await res3.json();

  if (evolutionChain.chain.evolves_to.length < 1) {
    pokename.innerText += ` ${evolutionChain.chain.species.name} and then nothing`;
    getPokeImage(evolutionChain.chain.species.name, newDiv);
  } else {
    let names = [];
    let pokeImages = [];
    let one = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${evolutionChain.chain.species.name}`
    );
    let two = await one.json();
    names.push(evolutionChain.chain.species.name);
    pokeImages.push(two.sprites.front_default);
    console.log(evolutionChain);

    //*** IF THE POKEMON HAS AN EVOLUTION
    if (evolutionChain.chain.evolves_to.length > 0) {
      let divergence1 = []

      //FOR EACH EVOLUTION ANOTHER FETCH IS NECESSARY TO RETRIEVE THE IMAGE URL
      evolutionChain.chain.evolves_to.forEach(index => {
        //IF THERE IS MORE THAN ONE (SEE EEVEE) MULTIPLE FETCHS WILL BE CALLED
        divergence1.push(index.species.name);
        multiplePokes(
        index.species.name,
        pokeImages
      );})
      names.push(divergence1.join(' or '))

      //***IF THAT EVOLUTION HAS AN EVOLUTION */
      if (evolutionChain.chain.evolves_to[0].evolves_to.length > 0) {
      let divergence2 = []
      evolutionChain.chain.evolves_to[0].evolves_to.forEach(index => {
        //IF THERE IS MORE THAN ONE (SEE ODDISH) MULTIPLE FETCHS WILL BE CALLED
        divergence2.push(index.species.name)
        multiplePokes(
        index.species.name,
        pokeImages
      );
      })
      names.push(divergence2.join(' or '))
    
    }
    }
    
    //THIS IS CLUNKY AND ANNOYING
    setTimeout(() => {
      pokeImages.forEach((img) => {
        let pokeImg = document.createElement("img");
        pokeImg.src = img;
        newDiv.appendChild(pokeImg);
      });
      pokename.innerText += names.join(" and then ") + ".";
    }, 1000);
  }
}

//WTF AM I DOING HERE
async function multiplePokes(name, array) {
  let one = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  let two = await one.json();
  array.push(two.sprites.front_default);
  console.log(two.name)
}


//NON ASYNC FUNCTION THAT WORKS FINE FOR ONE REQUEST
function getPokeImage(pokemon, div) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then((res) => res.json()) // parse response as JSON
    .then((data) => {
      console.log(data.sprites.front_default);
      let pokeImg = document.createElement("img");
      pokeImg.src = data.sprites.front_default;
      div.appendChild(pokeImg);
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}
