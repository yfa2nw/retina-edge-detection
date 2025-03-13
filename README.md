# Retina and Vision - Edge Detection

Webpage link: https://yfa2nw.github.io/retina-edge-detection/

This project is a webpage that focuses on the retina inside the human eye and how the circuitry of our retina allows us to have the capability of detecting edges (sparsification). It is divided into 2 main parts:

1. The Simulation
2. The Explanation

The simulation contains the protagonist of this project - ON/OFF-RGC circuitry and lateral inhibition. The explanation section contains most of the texts and diagrams required to explain edge detection. Some diagrams are made in canva.com while some are referenced from Wikimedia Commons.

## The Simulation

The simulation contains 4 parts:

1. The buttons
2. The receptive field container
3. The horizontal cross section of the receptive field
4. The scales

The simulation is exclusively for edge detection (sparsification) only. Other concepts such as direction selectivity, color perception, etc. do not fit into this simulation.

### The Buttons

There are 5 buttons. 4 of them correspond to 4 different "extremes" of scenarios involved in edge detection, with them being "center response", "surround response", "both response", and "neither response", respectively.

- Center response has light in center RF and no light in surround RF.
- Surround response has light in surround RF and no light in center RF.
- Both response has light in both center and surround RF.
- Neither response has no light in neither center nor surround RF.

(RF denotes "receptive field" - the retinal ganglion cell that links to the group of rods or cones that are responsible for a part of our visual field)

The last button - the "custom response" - makes the white circle in the center (which denotes the shining light) in the receptive field container draggable. By dragging around the circle in this "custom response" mode, the cross section of the receptive field will change accordingly. I set the update to be 1 update per 100ms when the button is clicked. Otherwise, there will be no update.

### The RF Container

The RF Container is quite straightforward. It is the receptive field of a specific retinal ganglion cell. We can divide each receptive field into a surround and center region. Depending on how light interacts with the surround and/or center regions, the retinal ganglion cell can react differently.

### The Cross Section

So, imagine the RF Container being the top-down view of a cake. This cross section container is basically what we see if we slice it in half and look at the cross section. As we can see, there are rods/cones, horizontal cells, bipolar cells, and retinal ganglion cells present in this cross section. Note that the simulation assumes ON bipolar cells. If we have OFF bipolar cells, the retinal ganglion cell will basically have an opposite response (depolarization becomes hyperpolarization and vice versa).

### The Scales

The scales are quite intuitive. There's one scale that's not mentioned but can be heavily inferred - the white color in the RF container denotes the presence of light, while the black color denotes the lack of light. 

In this project, I decided to use numbers to denote cell activity because it's very easy to calculate how activities in one cell can affect another (as long as I assume linearity, maybe it's not accurate, but it sure is convenient and easy to understand and implement).

- Cell depolarization is assigned with the number +1 and the color yellow.
- Cell hyperpolarization is assigned with the number -1 and the color blue.
- Spontaneous activity is assigned with the number 0 and the color gray.

I am not doing red/green because I'm red/green colorblind (kind of).

## The Explanation

The explanation is where a lot of text gets dumped. I tried my best to include helpful diagrams (from Wikimedia Commons, and if not available, created by myself on canva.com). The explanation section is roughly divided into 4 subsections:

1. The Anatomy of the Eye
2. Biochemistry and Signal Transduction
3. Edge Detection (Sparsification)
4. Visual Illusions

The anatomy of the eye is there to give a brief introduction to orient ourselves with what we're working with. Honestly, the information is there mostly for anatomical documentation purposes. Only the bolded contents are actually important for the aspiring neurobiologists - the rest are for future optometrists or ophthalmologists.

The "Biochemistry and signal transduction" part is where some new ideas get introduced. I particularly want to explain this concept from the perspective of a function that takes inputs and shoots out outputs. Each cell inside the retina has a specific configuration determined by their receptors, signal transduction mechanisms, and neurotransmitters released that allow specific functions. For example, rods take in an input of +1 (presence of light) and shoots out -1 (hyperpolarization) because of... whatever is happening inside the rods. I would love to get into the details (and possible visualizations) of the biochemistry behind every cell because phototransduction is cool, but this is not the focus here. Consequently, I decided to only include the concepts of the "machine" in and touch on biochemistry a little bit.

Then, once we are acquainted with this concept of "machines taking in inputs and shooting out outputs", we can start constructing circuits. We can connect in such a way that allows us to sparsify what we see. In other words, we can detect edges better. Of course, we can always construct circuits that give us different retinal ganglion cell output depending on the scenario, but that's not the focus here. However, an important concept here is that different circuits yield different functionalities.

Finally, we will look at how our edge detection circuitry can also give us illusions by looking at the Hermann grid and Mach bands. These are basically fun applications of our edge detection system. However, other than those fun illusions, I would say our edge detection system is quite refined.

## Miscellaneous

Usually, I would contain some problem sets for practice but I'm swarmed with other work. Maybe I'll update this project in the future to have it contain some problems.

Also, as mentioned in the webpage itself, this GitHub project is actually a side project I decided to dive into. It is designed to be a supplementary material for Project MEEP - pre-Medical Electronic Education Platform - a website dedicated to create high-quality, accessible, practice-heavy education materials for aspiring medical students.

As of 2025, the website is still heavily under construction (the bugs keep coming), but do visit! it's https://yfmeep.com

Also, I am not a proficient coder by any means, so please forgive me if the code looks atrocious.
