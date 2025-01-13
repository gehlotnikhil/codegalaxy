let a = `
func main() {
	var a, b int
	fmt.Scan(&a)
	fmt.Scan(&b)
	fmt.Println(addTwoNumber(a, b))
}
`

console.log(JSON.stringify(a)) 
