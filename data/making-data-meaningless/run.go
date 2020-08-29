package main

import (
	"bufio"
	"encoding/csv"
	"io"
	"io/ioutil"
	"math/rand"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
)

type user struct {
	id     string
	name   string
	email  string
	gender string
	age    int
}

func (u user) toStringArray() []string {
	return []string{u.id, u.name, u.email, u.gender, strconv.Itoa(u.age)}
}

func getTitleReadHead() []string {
	return []string{"USER_ID", "ITEM_ID", "TIMESTAMP", "TITLE", "EVENT_TYPE"}
}

func getUserHead() []string {
	return []string{"USER_ID", "NAME", "EMAIL", "GENDER", "AGE"}
}

var dvcIDMapGlobal map[string]string = make(map[string]string)
var outputDirectory = "output"

func main() {
	os.RemoveAll(outputDirectory)
	os.Mkdir(outputDirectory, 0755)

	idMap := processTitle()
	userIDMap := processTitleRead(idMap)
	processPseudoUserData(userIDMap)

	return
}

func processTitle() map[string]string {
	// Data format
	// "ITEM_ID","CREATION_TIMESTAMP","TITLE"
	// "1","2019-08-16 04:48:10.032","개구리공주"

	rows := preprocessTitleAndTagData()
	// writeCsv(rows, "temp.csv")
	// os.Exit(0)

	head := rows[0]
	data := rows[1:]

	// shuffle id
	ids := getColumn(data, 0)
	shuffledIds := make([]string, len(ids))

	copy(shuffledIds, ids)

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(shuffledIds), func(i, j int) { shuffledIds[i], shuffledIds[j] = shuffledIds[j], shuffledIds[i] })

	idMap := make(map[string]string)

	for i := 0; i < len(rows)-1; i++ {
		idMap[ids[i]] = shuffledIds[i]
	}

	for _, r := range data {
		r[0] = idMap[r[0]]
	}

	modifiedData := convertDateTimeColumnToUnixEpochTime(data, []int{1})
	sort.Slice(modifiedData, func(i, j int) bool {
		o1, err1 := strconv.Atoi(modifiedData[i][0])
		check(err1)
		o2, err2 := strconv.Atoi(modifiedData[j][0])
		check(err2)

		return o1 < o2
	})

	os.Mkdir(outputDirectory+"/title", 0755)
	writeCsv(append([][]string{head}, modifiedData...), "output/title/title.csv")

	return idMap
}

// Return format
// ITEM_ID,CREATION_TIMESTAMP,TITLE,TAG
// 1,2019-08-16 04:48:10.032,개구리공주,1|4|11
// 2,2019-08-16 04:50:12.047,하루의 끝을 당신과,4|11
// 3,2019-08-16 04:52:31.480,환상여행,1|7
func preprocessTitleAndTagData() [][]string {
	// Data format: title.csv
	// "ITEM_ID","CREATION_TIMESTAMP","TITLE"
	// "1","2019-08-16 04:48:10.032","개구리공주"

	// Data format: tag.csv
	// id,name,type,visibility,title_count,recommended,recommendation_order
	// 1,판타지,GENRE,PUBLIC,22,1,6
	// 2,유머,GENRE,PUBLIC,12,1,2

	// Data format: title_tag.csv
	// title_id,tag_id
	// 1,1
	// 3,1

	titleRows := readCsvFile("input/title/title.csv")
	titleHead := titleRows[0]
	titleData := titleRows[1:]

	tagRows := readCsvFile("input/tag/tag.csv")
	tagData := tagRows[1:]

	titleTagRows := readCsvFile("input/tag/title_tag.csv")
	titleTagData := titleTagRows[1:]

	visibleAndGenreTitleTagIDMap := make(map[string]bool)
	for _, tag := range tagData {
		if tag[2] == "GENRE" && tag[3] == "PUBLIC" {
			visibleAndGenreTitleTagIDMap[tag[0]] = true
		}
	}

	tagIdsMappedByTitleID := make(map[string][]string)
	for _, titleTag := range titleTagData {
		if _, ok := tagIdsMappedByTitleID[titleTag[0]]; !ok {
			tagIdsMappedByTitleID[titleTag[0]] = []string{}
		}

		if visibleAndGenreTitleTagIDMap[titleTag[1]] {
			tagIdsMappedByTitleID[titleTag[0]] = append(tagIdsMappedByTitleID[titleTag[0]], titleTag[1])
		}
	}

	for i, titleRow := range titleData {
		tagIds, ok := tagIdsMappedByTitleID[titleRow[0]]
		if !ok || len(tagIds) == 0 {
			continue
		}

		titleData[i] = append(titleRow, strings.Join(tagIds, "|"))
	}

	titleHead = append(titleHead, "TAG")

	// shuffle title names
	titleNames := []string{}
	for _, titleRow := range titleData {
		titleNames = append(titleNames, titleRow[2])
	}

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(titleNames), func(i, j int) { titleNames[i], titleNames[j] = titleNames[j], titleNames[i] })

	for i := range titleData {
		titleData[i][2] = titleNames[i]
	}

	return append([][]string{titleHead}, titleData...)
}

func processTitleRead(idMap map[string]string) []string {
	inputDir := "input/title-read"
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

	rows := [][]string{}
	for _, path := range csvPaths {
		rows = append(rows, readCsvFile(path)[1:]...)
	}

	sort.Slice(rows, func(i, j int) bool { return rows[i][2] < rows[j][2] })

	dvcIDs := []string{}

	for _, r := range rows {
		dvcIDs = append(dvcIDs, r[0])
	}

	dvcIDMap := make(map[string]string)

	for i := 0; i < len(rows); i++ {
		newUUID, _ := uuid.NewRandom()
		dvcIDMap[dvcIDs[i]] = newUUID.String()
	}

	for i := 0; i < len(rows); i++ {
		rows[i][0] = dvcIDMap[rows[i][0]]
		rows[i][1] = idMap[rows[i][1]]
	}

	rowsDividedByMonth := divideByMonth(rows)

	for k, v := range rowsDividedByMonth {
		os.Mkdir(outputDirectory+"/title-read", 0755)
		dateTimeConverted := convertDateTimeColumnToUnixEpochTime(v, []int{2})

		writeCsv(append([][]string{getTitleReadHead()}, dateTimeConverted...), outputDirectory+"/title-read/"+"title-read-"+k+".csv")
	}

	userIDs := make([]string, 0, len(dvcIDMap))
	for _, value := range dvcIDMap {
		userIDs = append(userIDs, value)
	}

	return userIDs
}

func ageGenerator() int {
	r := rand.Float64()

	if r < 0.4 {
		return 10
	} else if r < 0.7 {
		return 20
	} else if r < 0.9 {
		return 30
	} else if r < 0.95 {
		return 40
	} else if r < 0.98 {
		return 50
	} else {
		return 60
	}
}

func processPseudoUserData(userIDs []string) {
	users := make([][]string, 0, len(userIDs))

	for i, userID := range userIDs {
		name := "username" + strconv.Itoa(i+1)
		email := name + "@aws-dna.org"
		gender := "FEMALE"
		if rand.Float64() > 0.6 {
			gender = "MALE"
		}

		age := ageGenerator()

		users = append(users, user{
			id:     userID,
			name:   name,
			email:  email,
			gender: gender,
			age:    age,
		}.toStringArray())
	}

	rows := append([][]string{getUserHead()}, users...)
	os.Mkdir(outputDirectory+"/user", 0755)
	writeCsv(rows, outputDirectory+"/user/"+"user.csv")
}

func readCsvFile(path string) [][]string {
	// Open the file
	csvfile, err := os.Open(path)
	check(err)
	defer csvfile.Close()

	// Parse the file
	r := csv.NewReader(bufio.NewReader(csvfile))
	r.LazyQuotes = true

	// Iterate through the records
	rows := [][]string{}

	for {
		// Read each record from csv
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			check(err)
		}

		rows = append(rows, record)
	}

	return rows
}

func getColumn(rows [][]string, index int) []string {
	column := []string{}

	for _, row := range rows {
		column = append(column, row[index])
	}

	return column
}

func convertToUnixEpochTime(datetime string) int64 {
	time, err := time.Parse("2006-01-02 15:04:05.000", datetime)
	check(err)

	return time.Unix()
}

func convertDateTimeColumnToUnixEpochTime(rows [][]string, indicesOfDateTimeColumns []int) [][]string {
	for _, r := range rows {
		for _, i := range indicesOfDateTimeColumns {
			r[i] = strconv.FormatInt(convertToUnixEpochTime(r[i]), 10)
		}
	}

	return rows
}

func writeCsv(rows [][]string, path string) {
	file, err := os.Create(path)
	check(err)
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	for _, r := range rows {
		err := writer.Write(r)
		check(err)
	}
}

func divideByMonth(allRows [][]string) map[string][][]string {
	toMonth := 7
	m := make(map[string][][]string)
	yearAndMonth := allRows[0][2][:toMonth]

	for _, r := range allRows {
		if yearAndMonth == r[2][:toMonth] {
			m[yearAndMonth] = append(m[yearAndMonth], r)
		} else {
			yearAndMonth = r[2][:toMonth]
		}
	}

	return m
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
