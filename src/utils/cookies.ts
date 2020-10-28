export const setCookie = (cname: string, cvalue: string | number | boolean, options: { expiresIn: number }): void => {
	const { expiresIn } = options
	const d = new Date()
	d.setTime(d.getTime() + (expiresIn * 1000))
	const cexpires = `expires=${d.toUTCString()}`
	document.cookie = `${cname}=${cvalue};${cexpires};path=/;SameSite=Strict`
}

export const getCookie = (cname: string): string => {
	const name = `${cname}=`
    const ca = document.cookie.split(';')

	for (let i = 0; i < ca.length; i++) {
		let c = ca[i]
		while (c.charAt(0) === ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length)
		}
    }

	return ''
}

export const deleteCookie = (name: string): void => {
	setCookie(name, '', {
		expiresIn: -1,
	})
}
