export function CTASection() {
  return (
    <section id="cta" className="py-10 sm:py-12 px-4 sm:px-6 reveal">
      <div className="max-w-5xl mx-auto min-w-0 bg-gradient-to-br from-lightrose via-rose/10 to-gold/20 rounded-3xl sm:rounded-[3rem] p-1 shadow-soft border border-lightrose">
        <div className="bg-white/95 backdrop-blur-sm rounded-[1.25rem] sm:rounded-[2.9rem] px-5 py-10 sm:px-10 sm:py-12 md:px-12 md:py-16 lg:p-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate mb-4 sm:mb-6 leading-tight text-balance break-words">
            Tìm mẫu thiệp cưới hoàn hảo cho ngày trọng đại của bạn
          </h2>
          <p className="text-slate/60 text-base sm:text-lg mb-2 max-w-xl mx-auto font-light px-1">
            Tạo trải nghiệm • Không cần thẻ tín dụng
          </p>
          <p className="text-xs sm:text-sm text-slate/50 mb-8 sm:mb-10 px-1">
            Nhận 10 mẫu thiệp hot mỗi tuần qua email
          </p>
          <div className="flex flex-col gap-4 justify-center items-stretch sm:items-center max-w-lg sm:max-w-none mx-auto w-full">
            <a
              href="#templates"
              className="inline-flex justify-center px-8 sm:px-10 py-3.5 sm:py-4 bg-rose text-white text-sm sm:text-base font-medium rounded-full hover:bg-rose/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto sm:min-w-[240px]"
            >
              Khám phá các mẫu thiệp
            </a>
            <form
              className="flex flex-col gap-3 w-full sm:flex-row sm:max-w-md sm:mx-auto sm:justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full min-w-0 flex-1 px-4 sm:px-5 py-3 rounded-full border border-lightrose focus:outline-none focus:ring-2 focus:ring-rose/30 text-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-6 py-3 bg-gold text-white rounded-full font-medium text-sm hover:bg-gold/90 transition-colors"
              >
                Nhận mẫu
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
