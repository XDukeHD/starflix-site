export interface Movie {
	id: number;
	title: string;
	backdrop: string;
	poster: string;
	rating: number;
	year: number;
	genres: string[];
	ageRating: string;
	description: string;
}

export const MOVIES: Movie[] = [
	{
		id: 1,
		title: "O Senhor dos Anéis: O Retorno do Rei",
		backdrop: "https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/gMqQY6SwuhKg1LvmiTxKX6YrINr.jpg",
		poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/euKFiO5M125rpngFRBbSW83beeI.jpg",
		rating: 9.5,
		year: 2003,
		genres: ["Aventura", "Fantasia"],
		ageRating: "12",
		description: "O confronto final entre as forças do bem e do mal que lutam pelo controle da Terra Média."
	},
	{
		id: 2,
		title: "Interestelar",
		backdrop: "https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/gMqQY6SwuhKg1LvmiTxKX6YrINr.jpg",
		poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/euKFiO5M125rpngFRBbSW83beeI.jpg",
		rating: 9.3,
		year: 2014,
		genres: ["Ficção Científica", "Drama"],
		ageRating: "10",
		description: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade."
	},
	{
		id: 3,
		title: "Batman: O Cavaleiro das Trevas",
		backdrop: "https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/gMqQY6SwuhKg1LvmiTxKX6YrINr.jpg",
		poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/euKFiO5M125rpngFRBbSW83beeI.jpg",
		rating: 9.4,
		year: 2008,
		genres: ["Ação", "Crime"],
		ageRating: "14",
		description: "Quando a ameaça conhecida como o Coringa emerge de seu passado misterioso, ele causa estragos e caos no povo de Gotham."
	},
	{
		id: 4,
		title: "A Origem",
		backdrop: "https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/gMqQY6SwuhKg1LvmiTxKX6YrINr.jpg",
		poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/euKFiO5M125rpngFRBbSW83beeI.jpg",
		rating: 8.8,
		year: 2010,
		genres: ["Ação", "Ficção Científica"],
		ageRating: "14",
		description: "Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos."
	},
	{
		id: 5,
		title: "Pulp Fiction",
		backdrop: "https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/gMqQY6SwuhKg1LvmiTxKX6YrINr.jpg",
		poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/euKFiO5M125rpngFRBbSW83beeI.jpg",
		rating: 9.2,
		year: 1994,
		genres: ["Crime", "Drama"],
		ageRating: "18",
		description: "As vidas de dois assassinos da máfia, um boxeador, a esposa de um gângster e dois bandidos se entrelaçam em quatro histórias de violência e redenção."
	}
];

export const TOP_MOVIES = MOVIES.slice(0, 5).concat(MOVIES.slice(0, 5));
export const TOP_SERIES = MOVIES.slice(0, 5).concat(MOVIES.slice(0, 5)).map(m => ({...m, title: m.title + " (Série)"}));
