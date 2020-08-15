package main

import (
	"bufio"
	"encoding/csv"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"os"
	"sort"
	"strconv"
	"time"

	"github.com/google/uuid"
)

type csvRow struct {
	dvcID string
	name  string
	id    int
	date  string
}

func (r csvRow) toStringSlice() []string {
	return []string{r.dvcID, r.name, strconv.Itoa(r.id), r.date}
}

func getCsvHead() []string {
	return []string{"dvc_id", "name", "id", "log_date"}
}

func main() {
	outputFileNamePrefix := os.Args[1]
	inputDir := "input"
	files, err := ioutil.ReadDir(inputDir)
	check(err)

	csvPaths := []string{}
	for _, file := range files {
		fileName := file.Name()
		if file.IsDir() || fileName[len(fileName)-4:len(fileName)] != ".csv" {
			continue
		}
		csvPaths = append(csvPaths, inputDir+"/"+fileName)
	}

	outputDirectory := "output"
	os.RemoveAll(outputDirectory)

	rows := []csvRow{}
	for _, path := range csvPaths {
		rows = append(rows, getRows(path)...)
	}

	sort.Slice(rows, func(i, j int) bool { return rows[i].date < rows[j].date })

	ids := []int{}
	dvcIDs := []string{}

	for _, r := range rows {
		ids = append(ids, r.id)
		dvcIDs = append(dvcIDs, r.dvcID)
	}

	shuffledIds := make([]int, len(ids))

	copy(shuffledIds, ids)

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(shuffledIds), func(i, j int) { shuffledIds[i], shuffledIds[j] = shuffledIds[j], shuffledIds[i] })

	idMap := make(map[int]int)
	dvcIDMap := make(map[string]string)

	for i := 0; i < len(rows); i++ {
		idMap[ids[i]] = shuffledIds[i]
		newUUID, _ := uuid.NewRandom()
		dvcIDMap[dvcIDs[i]] = newUUID.String()
	}

	for i := 0; i < len(rows); i++ {
		rows[i].id = idMap[rows[i].id]
		rows[i].dvcID = dvcIDMap[rows[i].dvcID]
	}

	rowsDividedByMonth := divideByMonth(rows)

	os.Mkdir(outputDirectory, 0755)
	for k, v := range rowsDividedByMonth {
		file, err := os.Create(outputDirectory + "/" + outputFileNamePrefix + "-" + k + ".csv")
		check(err)
		defer file.Close()

		writer := csv.NewWriter(file)
		defer writer.Flush()

		writer.Write(getCsvHead())
		for _, r := range v {
			err := writer.Write(r.toStringSlice())
			check(err)
		}
	}
}

func getRows(path string) []csvRow {
	// Open the file
	csvfile, err := os.Open(path)
	if err != nil {
		log.Fatalln("Couldn't open the csv file", err)
	}

	// Parse the file
	r := csv.NewReader(bufio.NewReader(csvfile))
	r.LazyQuotes = true

	// Iterate through the records
	rows := []csvRow{}

	r.Read() // skip first row

	for {
		// Read each record from csv
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		var row csvRow
		row.dvcID = record[0]
		row.name = record[1]
		row.id, _ = strconv.Atoi(record[2])
		row.date = record[3]

		rows = append(rows, row)
	}

	return rows
}

func divideByMonth(allRows []csvRow) map[string][]csvRow {
	toMonth := 7
	m := make(map[string][]csvRow)
	yearAndMonth := allRows[0].date[:toMonth]

	for _, r := range allRows {
		if yearAndMonth == r.date[:toMonth] {
			m[yearAndMonth] = append(m[yearAndMonth], r)
		} else {
			yearAndMonth = r.date[:toMonth]
		}
	}

	return m
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
