from setuptools import setup, find_packages

setup(
    name="colorit",
    version="0.0.1",
    description="Custom Navbar Color and Help Menu Customization",
    author="Your Company",
    author_email="your@email.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=["frappe"]
)
